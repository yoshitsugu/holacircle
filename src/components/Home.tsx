import React, { FC } from 'react';
import { Task } from 'models/Task';

interface HomeProps {
  title: string;
  onChangeTitle: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCAddClick: () => void;
  onDeleteClick: (id: number) => void;
  tasks: Task[];
}

const Home: FC<HomeProps> = ({
  title =  'デフォルトタイトル',
  onChangeTitle =  (e: React.ChangeEvent<HTMLInputElement>) => { console.log(e.target.value) },
  onCAddClick = () => {console.log('add cliked') },
  onDeleteClick = () => {console.log('delete cliked') },
  tasks = []
}) => {
  return (
    <>
      <table>
        <thead>
          <tr>
            <th>id</th>
            <th>title</th>
            <th>done</th>
            <th>削除</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((t) => (
            <tr key={t.id}>
              <td>{t.id}</td>
              <td>{t.title}</td>
              <td>{t.done}</td>
              <td><button onClick={() => onDeleteClick(t.id)}>del</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <input type="text" onChange={onChangeTitle} value={title} />
      <button onClick={onCAddClick}>新規追加</button>
    </>
  );
};

export default Home;
