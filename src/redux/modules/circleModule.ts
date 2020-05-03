import { createSlice } from '@reduxjs/toolkit';
import Circle from 'models/Circle';

type State = {
  rootCircle: Circle;
};

const rakuen = new Circle({
  name: '楽園',
});

const hogekanri = new Circle({
  name: '株式会社XXX ほげほげ管理基盤',
});

const launchUpDiv = new Circle({
  name: 'LaunchUp Div',
  circles: [rakuen],
});

const ojisan = new Circle({
  name: 'おじさんファンクラブ',
  circles: [],
});

const communityDiv = new Circle({
  name: 'Community Div',
  circles: [ojisan],
});

const sengoku = new Circle({
  name: '戦国 Subdiv',
  circles: [],
});

const seed = new Circle({
  name: 'seed subdiv',
  circles: [],
});

const txdiv = new Circle({
  name: 'TX Div',
  circles: [sengoku, seed],
});

const pm = new Circle({
  name: 'プロジェクトマネジメント',
  circles: [txdiv, launchUpDiv, communityDiv],
});

const onlineevent = new Circle({
  name: 'オンラインイベント',
  circles: [],
});

const comunittymarketing = new Circle({
  name: 'コミュニティーマーケティング',
  circles: [],
});

const kikaku = new Circle({
  name: '企画',
  circles: [onlineevent, comunittymarketing],
});

const initialState: State = {
  rootCircle: new Circle({
    name: 'sikmi',
    roles: [],
    circles: [pm, kikaku],
  }),
};

const circleModule = createSlice({
  name: 'circles',
  initialState,
  reducers: {},
});

export default circleModule;
