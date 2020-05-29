import React, { FC, useState, useEffect } from 'react';
import styled from 'styled-components';

import Circle from 'models/Circle';
import Role from 'models/Role';
import HcInput from 'components/forms/HcInput';
import HcTextarea from 'components/forms/HcTextarea';
import HcButton from 'components/parts/HcButton';
import { useUpdateRoleMutation } from 'generated/graphql';
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

const EditButton = styled.div`
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

type CircleInfoProps = {
  focus: Circle | Role;
};

const CircleInfo: FC<CircleInfoProps> = ({ focus }) => {
  const [editingName, setEditingName] = useState<string>(focus.name);
  const [editingPurpose, setEditingPurpose] = useState<string>(focus.purpose);
  const [editingDomains, setEditingDomains] = useState<string>(focus.domains);
  const [editingAccountabilities, setEditingAccountabilities] = useState<string>(focus.accountabilities);
  const [editMode, setEditMode] = useState<boolean>(false);

  const mutationCompletedHandler = (): void => {
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

  const [updateMutation, { loading }] = useUpdateRoleMutation({
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

  useEffect(() => {
    setEditingName(focus.name);
    setEditingPurpose(focus.purpose);
    setEditingDomains(focus.domains);
    setEditingAccountabilities(focus.accountabilities);
    setEditMode(false);
  }, [focus]);

  const submit = (e: React.MouseEvent) => {
    e.preventDefault();
    updateMutation();
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
          <HcButton onClick={submit} disabled={loading}>
            保存
          </HcButton>
        ) : (
          <EditButton onClick={() => setEditMode(true)}>
            <i className="material-icons">edit</i>
          </EditButton>
        )}
      </PageTitle>
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
    </Wrapper>
  );
};

export default CircleInfo;
