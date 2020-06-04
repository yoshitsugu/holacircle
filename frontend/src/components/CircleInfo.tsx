import React, { FC, useState, useEffect } from 'react';
import styled from 'styled-components';
import { ApolloQueryResult } from 'apollo-boost';
import { setFocus } from 'redux/modules/focusModule';
import { useDispatch } from 'react-redux';

import Circle from 'models/Circle';
import Role from 'models/Role';
import HcInput from 'components/forms/HcInput';
import HcTextarea from 'components/forms/HcTextarea';
import HcButton from 'components/parts/HcButton';
import {
  useUpdateRoleMutation,
  useNewRoleMutation,
  GetRolesQueryVariables,
  GetRolesQuery,
  NewRoleMutation,
} from 'generated/graphql';
import HcMessage from 'components/parts/HcMessage';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 18px;
  justify-content: flex-start;
  padding: 0 40px;

  h1 {
    margin: 20px 0 40px 0;
  }
`;

const PageTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ButtonContainer = styled.div`
  display: flex-end;
`;

const EditButton = styled.div`
  display: inline-block;
  cursor: pointer;
  width: 1.5rem;
  height: 1.5rem;
  font-size: 1.5rem;
`;

const InfoSection = styled.section`
  h2 {
    border-bottom: 1px solid #d5dbe1;
    font-size: 24px;
    margin: 0;
    padding-bottom: 10px;
  }
  margin-bottom: 40px;
`;

const InfoDetail = styled.div`
  padding: 20px 0;
  white-space: pre-wrap;
`;

const InfoForm = styled.div`
  padding-top: 10px;
  input,
  textarea {
    width: 90%;
  }
`;

const TitleForm = styled.div`
  padding-top: 20px;
  > input {
    font-size: 1.5rem;
  }
`;

const Members = styled.ul`
  &.members {
    margin-top: 20px;
  }
`;

const Member = styled.li`
  margin-bottom: 10px;
`;

type CircleInfoProps = {
  focus: Circle | Role;
  refetch: (variables?: GetRolesQueryVariables | undefined) => Promise<ApolloQueryResult<GetRolesQuery>>;
};

const CircleInfo: FC<CircleInfoProps> = ({ focus, refetch }) => {
  const [editingName, setEditingName] = useState<string>(focus.name);
  const [editingIsCircle, setEditingIsCircle] = useState<boolean>(false);
  const [editingPurpose, setEditingPurpose] = useState<string>(focus.purpose);
  const [editingDomains, setEditingDomains] = useState<string>(focus.domains);
  const [editingAccountabilities, setEditingAccountabilities] = useState<string>(focus.accountabilities);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [isUpdate, setIsUpdate] = useState<boolean>(true);
  const dispatch = useDispatch();

  const mutationCompletedHandler = (): void => {
    setEditMode(false);
    HcMessage({
      text: '更新しました',
      type: 'success',
    }).show();
  };

  const addCompletedHandler = (m: NewRoleMutation): void => {
    dispatch(setFocus(m.newRole.isCircle ? Number(m.newRole.id) : Number(m.newRole.roleId)));
    refetch();
    setEditMode(false);
    HcMessage({
      text: '更新しました',
      type: 'success',
    }).show();
  };

  const mutationErrorHandler = (): void => {
    setEditMode(false);
    HcMessage({
      text: '更新失敗しました',
      type: 'error',
    }).show();
  };

  const [updateRoleMutation, { loading: updateLoading }] = useUpdateRoleMutation({
    variables: {
      id: String(focus.id),
      name: editingName,
      purpose: editingPurpose,
      domains: editingDomains,
      accountabilities: editingAccountabilities,
    },
    onCompleted: mutationCompletedHandler,
    onError: mutationErrorHandler,
  });

  const [newRoleMutation, { loading: newLoading }] = useNewRoleMutation({
    variables: {
      name: editingName,
      isCircle: editingIsCircle,
      purpose: editingPurpose,
      domains: editingDomains,
      accountabilities: editingAccountabilities,
      roleId: String(focus.id),
    },
    onCompleted: addCompletedHandler,
    onError: mutationErrorHandler,
  });

  useEffect(() => {
    setEditingName(focus.name);
    setEditingPurpose(focus.purpose);
    setEditingDomains(focus.domains);
    setEditingAccountabilities(focus.accountabilities);
    setEditMode(false);
  }, [focus]);

  const submit = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isUpdate) {
      updateRoleMutation();
    } else {
      newRoleMutation();
    }
  };
  return (
    <Wrapper>
      <PageTitle>
        {editMode ? (
          <TitleForm>
            <HcInput name="name" value={editingName} onChange={(e) => setEditingName(e.target.value)} />
          </TitleForm>
        ) : (
          <h1>{focus.name}</h1>
        )}
        {editMode ? (
          <HcButton onClick={submit} disabled={isUpdate ? updateLoading : newLoading}>
            保存
          </HcButton>
        ) : (
          <ButtonContainer>
            <EditButton
              onClick={() => {
                setEditMode(true);
                setIsUpdate(true);
              }}
            >
              <i className="material-icons">edit</i>
            </EditButton>
            <EditButton
              onClick={() => {
                setEditMode(true);
                setIsUpdate(false);
                setEditingName('');
                setEditingPurpose('');
                setEditingDomains('');
                setEditingAccountabilities('');
              }}
            >
              <i className="material-icons">fiber_new</i>
            </EditButton>
          </ButtonContainer>
        )}
      </PageTitle>
      {editMode && !isUpdate && (
        <InfoSection>
          <h2>サークル</h2>
          <label htmlFor="is-cirlce">
            <input
              id="is-circle"
              type="checkbox"
              checked={editingIsCircle}
              onChange={(e) => setEditingIsCircle(e.target.checked)}
            />{' '}
            サークルとして追加
          </label>
        </InfoSection>
      )}
      <InfoSection>
        <h2>Purpose</h2>
        {editMode ? (
          <InfoForm>
            <HcInput name="purpose" value={editingPurpose} onChange={(e) => setEditingPurpose(e.target.value)} />
          </InfoForm>
        ) : (
          <InfoDetail>{focus.purpose}</InfoDetail>
        )}
      </InfoSection>
      <InfoSection>
        <h2>Domains</h2>
        {editMode ? (
          <InfoForm>
            <HcTextarea name="domains" value={editingDomains} onChange={(e) => setEditingDomains(e.target.value)} />
          </InfoForm>
        ) : (
          <InfoDetail>{focus.domains}</InfoDetail>
        )}
      </InfoSection>
      <InfoSection>
        <h2>Accountablities</h2>
        {editMode ? (
          <InfoForm>
            <HcTextarea
              name="accountabilities"
              value={editingAccountabilities}
              onChange={(e) => setEditingAccountabilities(e.target.value)}
            />
          </InfoForm>
        ) : (
          <InfoDetail>{focus.accountabilities}</InfoDetail>
        )}
      </InfoSection>
      <InfoSection>
        <h2>Members</h2>
        <Members className="members">
          {focus.members.map((m) => (
            <Member>{m.name}</Member>
          ))}
        </Members>
      </InfoSection>
    </Wrapper>
  );
};

export default CircleInfo;
