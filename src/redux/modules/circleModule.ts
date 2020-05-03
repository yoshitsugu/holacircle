import { createSlice } from '@reduxjs/toolkit';
import Circle from 'models/Circle';
import Role from 'models/Role';
import Member from 'models/Member';

type State = {
  rootCircle: Circle;
};

const tarou: Member = {
  name: '鈴木 太郎',
};

const jirou: Member = {
  name: '佐藤 次郎',
};

const john: Member = {
  name: 'ジョン スミス',
};

const facilitator: Role = {
  name: 'ファシリテーター',
  members: [tarou],
};

const secretary: Role = {
  name: 'セクレタリー',
  members: [tarou],
};

const lead: Role = {
  name: 'サークルリード',
  members: [tarou],
};

const rep: Role = {
  name: 'サークルレプ',
  members: [tarou],
};

const redWine: Role = {
  name: '赤ワイン',
  members: [tarou],
};

const whiteWine: Role = {
  name: '白ワイン',
  members: [],
};

const wine = new Circle({
  name: 'ワイン',
  roles: [facilitator, secretary, rep, lead, redWine, whiteWine],
});

const weizen: Role = {
  name: 'ヴァイツェン',
  members: [tarou, jirou],
};

const ipa: Role = {
  name: 'IPA',
  members: [john],
};

const blackBeer: Role = {
  name: '黒ビール',
  members: [],
};

const paleAle = new Circle({
  name: 'ペールエール',
  roles: [facilitator, secretary, rep, lead],
});

const whiteBeer = new Circle({
  name: '白ビール',
  roles: [facilitator, secretary, rep, lead],
});

const wiskey: Role = {
  name: 'ウィスキー',
  members: [],
};
const nihonshu: Role = {
  name: '日本酒',
  members: [],
};

const beer = new Circle({
  name: 'ビール',
  roles: [facilitator, secretary, rep, lead, weizen, ipa, blackBeer],
  circles: [paleAle, whiteBeer],
});

const sake = new Circle({
  name: '酒部',
  roles: [facilitator, secretary, rep, lead, wiskey, nihonshu],
  circles: [wine, beer],
});

const backend = new Circle({
  name: 'Webバックエンド',
  roles: [facilitator, secretary, rep, lead],
  circles: [],
});

const frontend = new Circle({
  name: 'Webフロントエンド',
  roles: [facilitator, secretary, rep, lead],
  circles: [],
});

const web = new Circle({
  name: 'Web',
  roles: [facilitator, secretary, rep, lead],
  circles: [backend, frontend],
});

const ios = new Circle({
  name: 'iOS',
  roles: [facilitator, secretary, rep, lead],
});

const android = new Circle({
  name: 'Android',
  roles: [facilitator, secretary, rep, lead],
});

const engineer = new Circle({
  name: 'エンジニア',
  roles: [facilitator, secretary, rep, lead],
  circles: [web, ios, android],
});

const smoke: Role = {
  name: '燻製',
  members: [john],
};

const anova: Role = {
  name: '低温調理',
  members: [john],
};

const cooking = new Circle({
  name: '料理部',
  roles: [facilitator, secretary, rep, lead, smoke, anova],
  circles: [],
});

const initialState: State = {
  rootCircle: new Circle({
    name: 'へこみ製作所',
    roles: [],
    circles: [sake, engineer, cooking],
  }),
};

const circleModule = createSlice({
  name: 'circles',
  initialState,
  reducers: {},
});

export default circleModule;
