import React, { useState, useEffect } from "react";
import styled, { useTheme } from "styled-components";
import { Typography, Tabs } from "antd";
import { useAuthState } from "react-firebase-hooks/auth";

import { getFirebase } from "../../firebase";
import {
  useInstantProducts,
  useUserProfile,
  // useOnDemandProducts,
} from "./hooks";
import ProductCard from "../../shared-components/ProductCard";
import Spinner from "../../shared-components/Spinner";
import FilterDrawer from "../../shared-components/Drawer";
import ProductView from "./product-view";

const StyledContainer = styled.div``;

const Collections = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: ${(props) => props.theme.space[3]};
  align-content: center;
  align-items: center;
  gap: ${(props) => props.theme.space[3]};
  overflow: auto;
  @media (min-width: 330px) {
    grid-template-columns: 1fr 1fr 1fr;
    gap: ${(props) => props.theme.space[3]};
  }

  @media (min-width: 430px) {
    grid-template-columns: 1fr 1fr 1fr;
  }

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
`;

const StyledTabs = styled(Tabs)`
  width: 100%;
  .ant-tabs-tab-active {
    font-weight: ${(props) => props.theme.fontWeights.semibold};
  }
  .ant-tabs-nav {
    margin-bottom: ${(props) => props.theme.space[3]};
  }
`;

const Products = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [active, setActive] = useState("instant");
  const { auth } = getFirebase();
  const [user, userLoading] = useAuthState(auth);
  const [profile, profileLoading] = useUserProfile(user?.uid);

  const [instantProducts, iLoading] = useInstantProducts(profile?.id);
  // const [onDemandProducts, dLoading] = useOnDemandProducts(store?.id);

  useEffect(() => {
    if (active === "instant") {
      instantProducts && setProducts(instantProducts);
    }
  }, [instantProducts, active]);

  const handleActive = (type) => {
    setActive(type);
  };

  const getChildren = () => {
    if (!products || userLoading || profileLoading) return <Spinner />;
    if (active === "orders")
      return (
        <Typography.Text
          style={{
            color: theme.colors.text,
            textAlign: "center",
            display: "block",
            margin: theme.space[6],
          }}
        >
          No orders found
        </Typography.Text>
      );

    if (products.length === 0)
      return (
        <Typography.Text
          style={{
            color: theme.colors.text,
            textAlign: "center",
            display: "block",
            margin: theme.space[6],
          }}
        >
          No products found
        </Typography.Text>
      );

    return (
      <Collections
        dataLength={products.length}
        next={() => {}}
        hasMore={false}
        loader={<Spinner />}
        key={active}
      >
        {products.map((product, index) => {
          return (
            <ProductCard
              key={product.id + "-" + index}
              {...product}
              onClick={() => {
                setActiveProduct(product);
                setOpen(true);
              }}
            />
          );
        })}
      </Collections>
    );
  };

  return (
    <StyledContainer>
      {iLoading ? (
        <Spinner />
      ) : (
        <StyledTabs
          activeKey={active}
          onChange={(key) => handleActive(key)}
          size='small'
          centered
          items={[
            {
              key: "instant",
              label: "Products",
              children: getChildren(),
              forceRender: true,
            },
            {
              key: "orders",
              label: "Orders",
              children: getChildren(),
              forceRender: true,
            },
          ]}
        />
      )}

      {activeProduct && (
        <FilterDrawer
          open={open}
          title={null}
          onClose={() => {
            setActiveProduct(null);
            setOpen(false);
          }}
          closable
        >
          <ProductView
            product={activeProduct}
            handleClose={() => {
              setActiveProduct(null);
              setOpen(false);
            }}
          />
        </FilterDrawer>
      )}
    </StyledContainer>
  );
};

export default Products;
