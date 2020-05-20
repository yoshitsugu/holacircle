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
  id: 26,
  name: 'ファシリテーター',
  members: [tarou],
  purpose: 'Circle governance and operational practices aligned with the Constitution.',
  domains: 'This Role has not been granted a Domain to control.',
  accountabilities: '',
};

const secretary: Role = {
  id: 25,
  name: 'セクレタリー',
  members: [tarou],
  purpose: 'Steward the Circle’s governance records and stabilize its record-keeping process.',
  domains: 'All governance records of the Circle',
  accountabilities:
    'Scheduling Governance Meetings and Tactical Meetings of the Circle or called by its Roles, and notifying all invited participants',
};

const lead: Role = {
  id: 24,
  name: 'サークルリード',
  members: [tarou],
  purpose: '',
  domains: '',
  accountabilities: '',
};

const rep: Role = {
  id: 23,
  name: 'サークルレプ',
  members: [tarou],
  purpose: '',
  domains: '',
  accountabilities: '',
};

const redWine: Role = {
  id: 22,
  name: '赤ワイン',
  members: [tarou],
  purpose: '赤ワインをのむ',
  domains: '赤ワイン',
  accountabilities: '赤ワインの選定',
};

const whiteWine: Role = {
  id: 21,
  name: '白ワイン',
  members: [],
  purpose: '白ワインをのむ',
  domains: '白ワイン',
  accountabilities: '白ワインの選定',
};

const wine: Circle = {
  id: 20,
  name: 'ワイン',
  members: [],
  roles: [facilitator, secretary, rep, lead, redWine, whiteWine],
  circles: [],
  purpose: 'ワインをのむ',
  domains: 'ワイン',
  accountabilities: 'ワインの選定',
};

const weizen: Role = {
  id: 19,
  name: 'ヴァイツェン',
  members: [tarou, jirou],
  purpose: 'ヴァイツェンをのむ',
  domains: 'ヴァイツェン',
  accountabilities: 'ヴァイツェンの選定',
};

const ipa: Role = {
  id: 18,
  name: 'IPA',
  members: [john],
  purpose: 'IPAをのむ',
  domains: 'IPA',
  accountabilities: 'IPAの選定',
};

const blackBeer: Role = {
  id: 17,
  name: '黒ビール',
  members: [],
  purpose: '黒ビールをのむ',
  domains: '黒ビール',
  accountabilities: '黒ビールの選定',
};

const paleAle: Circle = {
  id: 16,
  name: 'ペールエール',
  roles: [facilitator, secretary, rep, lead],
  circles: [],
  members: [],
  purpose: 'ペールエールをのむ',
  domains: 'ペールエール',
  accountabilities: 'ペールエールの選定',
};

const whiteBeer: Circle = {
  id: 15,
  name: '白ビール',
  roles: [facilitator, secretary, rep, lead],
  circles: [],
  members: [],
  purpose: '白ビールをのむ',
  domains: '白ビール',
  accountabilities: '白ビールの選定',
};

const wiskey: Role = {
  id: 14,
  name: 'ウィスキー',
  members: [],
  purpose: 'ウィスキーをのむ',
  domains: 'ウィスキー',
  accountabilities: 'ウィスキーの選定',
};
const nihonshu: Role = {
  id: 13,
  name: '日本酒',
  members: [],
  purpose: '日本酒をのむ',
  domains: '日本酒',
  accountabilities: '日本酒の選定',
};

const beer: Circle = {
  id: 12,
  name: 'ビール',
  roles: [facilitator, secretary, rep, lead, weizen, ipa, blackBeer],
  circles: [paleAle, whiteBeer],
  members: [],
  purpose: 'ビールをのむ',
  domains: 'ビール',
  accountabilities: 'ビールの選定',
};

const sake: Circle = {
  id: 11,
  name: '酒部',
  roles: [facilitator, secretary, rep, lead, wiskey, nihonshu],
  circles: [wine, beer],
  members: [],
  purpose: '酒をのむ',
  domains: '酒',
  accountabilities: '酒の選定、購入、飲み会',
};

const backend: Circle = {
  id: 10,
  name: 'Webバックエンド',
  roles: [facilitator, secretary, rep, lead],
  circles: [],
  members: [],
  purpose: 'Webバックエンドやっていく',
  domains: '',
  accountabilities: 'Webバックエンドの知識集積、共有',
};

const frontend: Circle = {
  id: 9,
  name: 'Webフロントエンド',
  roles: [facilitator, secretary, rep, lead],
  circles: [],
  members: [],
  purpose: 'Webフロントエンドやっていく',
  domains: '',
  accountabilities: 'Webフロントエンドの知識集積、共有',
};

const web: Circle = {
  id: 8,
  name: 'Web',
  roles: [facilitator, secretary, rep, lead],
  circles: [backend, frontend],
  members: [],
  purpose: 'Webをやっていく',
  domains: '',
  accountabilities: 'Webの知識集積、共有',
};

const ios: Circle = {
  id: 7,
  name: 'iOS',
  roles: [facilitator, secretary, rep, lead],
  circles: [],
  members: [],
  purpose: 'iOSをやっていく',
  domains: '',
  accountabilities: 'iOSの知識集積、共有',
};

const android: Circle = {
  id: 6,
  name: 'Android',
  roles: [facilitator, secretary, rep, lead],
  circles: [],
  members: [],
  purpose: 'Androidをやっていく',
  domains: '',
  accountabilities: 'Androidの知識集積、共有',
};

const engineer: Circle = {
  id: 5,
  name: 'エンジニア',
  roles: [facilitator, secretary, rep, lead],
  circles: [web, ios, android],
  members: [],
  purpose: 'エンジニリングをやっていく',
  domains: '',
  accountabilities: 'エンジニアリング全般の知識集積、共有',
};

const smoke: Role = {
  id: 4,
  name: '燻製',
  members: [john],
  purpose: '燻製料理をたくさん作ってたくさん食べる',
  domains: '',
  accountabilities: '燻製料理の作成、共有',
};

const anova: Role = {
  id: 3,
  name: '低温調理',
  members: [john],
  purpose: '低温調理料理をたくさん作ってたくさん食べる',
  domains: '',
  accountabilities: '低温調理料理の作成、共有',
};

const cooking: Circle = {
  id: 2,
  name: '料理部',
  roles: [facilitator, secretary, rep, lead, smoke, anova],
  circles: [],
  members: [],
  purpose: '料理をやっていく',
  domains: '',
  accountabilities: '料理の知識集積、共有',
};

const rootCircle: Circle = {
  id: 1,
  name: 'へこみ製作所',
  roles: [],
  circles: [sake, engineer, cooking],
  members: [],
  purpose: 'へこみを制作する',
  domains: '',
  accountabilities: '',
};

const initialState: State = {
  rootCircle,
};

const circleModule = createSlice({
  name: 'circles',
  initialState,
  reducers: {},
});

export default circleModule;
