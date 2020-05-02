import React, { FC, useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { addTask, deleteTask } from 'redux/modules/taskModule';
import HomeComponent from 'components/Home'

const Home: FC<{}> = () => {
  const dispatch = useDispatch()
  const { tasks } = useSelector((state: RootState) => state.task)
  const [ title, setTitle ] = useState('')

  const onChangeTitle = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(e.target.value)
    }, []
  )

  const onAddClick = useCallback(() => {
    dispatch(addTask(title))
    setTitle('')
  }, [dispatch, title])

  const onDeleteClick = useCallback((id) => {
    dispatch(deleteTask(id))
  }, [dispatch])

  return <HomeComponent
    onChangeTitle={onChangeTitle}
    onCAddClick={onAddClick}
    onDeleteClick={onDeleteClick}
    tasks={tasks}
    title={title}
  />
};

export default Home;
