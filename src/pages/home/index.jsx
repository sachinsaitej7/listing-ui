import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled, { useTheme } from "styled-components";
import isEmpty from "lodash/isEmpty";
import { Typography, Badge, App } from "antd";
import { useAuthState } from "react-firebase-hooks/auth";

import Store from "../../store";
import { getFirebase } from "../../firebase";
import { useProductsByProfileId, useUserProfile } from "./hooks";
import { PageContainer } from "../../styled-components";
import Spinner from "../../shared-components/Spinner";
import EmptyPage from "./empty-page";
import AddNew from "./add-new";
import Products from "./products";
import { getProfileShareData, handleShare } from "./utils";
import { ReactComponent as SettingsIcon } from "../../assets/common/settings.svg";
import { ReactComponent as ShareIcon } from "../../assets/common/share.svg";
import {
  StyledButton,
  StyledStickyContainer,
  ProfileNameContainer,
  StyledTag as Tag,
} from "../../styled-components";

const { ProfileContext } = Store;

const StyledContainer = styled(PageContainer)`
  padding: ${(props) => props.theme.space[0]};
  justify-content: space-between;
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 64px);
`;

const StyledNameContainer = styled(ProfileNameContainer)`
  .name {
    h5 {
      margin: ${(props) => props.theme.space[0]};
    }
    margin-left: ${(props) => props.theme.space[3]};
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
`;

const StyledTag = styled(Tag)`
  display: inline-flex;
  align-items: center;
  background-color: ${(props) => props.theme.bg.default};
  font-weight: ${(props) => props.theme.fontWeights.semibold};
  font-size: ${(props) => props.theme.fontSizes[1]};
  margin: ${(props) => props.theme.space[0]};
`;

const HomePage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { message } = App.useApp();
  const { addNew, setAddNew } = useContext(ProfileContext);
  const { auth } = getFirebase();
  const [user, userLoading] = useAuthState(auth);
  const [profile, profileLoading] = useUserProfile(user?.uid);
  const [products, productLoading] = useProductsByProfileId(user?.uid);

  useEffect(() => {
    if (!profileLoading && !profile?.status) navigate("/onboarding");
  }, [navigate, profile, profileLoading, user, userLoading]);

  if (userLoading || profileLoading || productLoading)
    return (
      <StyledContainer>
        <Spinner />
      </StyledContainer>
    );

  if (addNew) return <AddNew profile={profile} />;

  if (!profile) return null;

  return (
    <StyledContainer>
      <div>
        <div
          style={{ padding: theme.space[5], backgroundColor: theme.bg.dark }}
        >
          <StyledNameContainer>
            <img src={profile.logo} alt='logo' width='100px'></img>
            <div className='name'>
              <Typography.Title level={5}>{profile.name}</Typography.Title>
              <Badge
                status={profile.status ? "success" : "error"}
                text={profile.status ? "Active" : "Inactive"}
                size='small'
              />
            </div>
          </StyledNameContainer>
          <div
            style={{
              marginTop: theme.space[3],
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <StyledTag icon={<SettingsIcon width='16px' />}>
              Profile Settings
            </StyledTag>
            <StyledTag
              icon={<ShareIcon width='16px' />}
              onClick={() => {
                handleShare(getProfileShareData(profile), (text) => {
                  message.success(text);
                });
              }}
            ></StyledTag>
          </div>
        </div>

        {isEmpty(products) ? (
          <EmptyPage profile={profile} onClick={() => setAddNew(true)} />
        ) : (
          <Products />
        )}
      </div>
      <StyledStickyContainer>
        <StyledButton
          style={{ width: "100%", marginTop: theme.space[0] }}
          onClick={() => setAddNew(true)}
        >
          List a product
        </StyledButton>
      </StyledStickyContainer>
    </StyledContainer>
  );
};

export default HomePage;
