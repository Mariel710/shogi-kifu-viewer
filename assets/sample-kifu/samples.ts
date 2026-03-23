// Bundled sample kifu for the SampleKifuList screen

export interface SampleKifu {
  id: string;
  title: string;
  description: string;
  content: string;
  filename: string;
}

export const SAMPLE_KIFU: SampleKifu[] = [
  {
    id: 'yagura',
    title: '矢倉サンプル',
    description: '矢倉（やぐら）の序盤例。5手で中断。',
    filename: 'sample-yagura.kif',
    content: `手合割：平手
手数----指手---------消費時間--
   1 ７六歩(77)
   2 ８四歩(83)
   3 ６八銀(79)
   4 ３四歩(33)
   5 ６六歩(67)
まで5手で中断`,
  },
  {
    id: 'nakabisha',
    title: '中飛車サンプル',
    description: '中飛車（なかびしゃ）の序盤例。5手で中断。',
    filename: 'sample-nakabisha.kif',
    content: `手合割：平手
手数----指手---------消費時間--
   1 ７六歩(77)
   2 ３四歩(33)
   3 ５八飛(28)
   4 ８四歩(83)
   5 ５六歩(57)
まで5手で中断`,
  },
  {
    id: 'tsume',
    title: '詰将棋（3手詰）',
    description: '3手詰めの詰将棋サンプル。',
    filename: 'sample-tsume.kif',
    content: `手合割：詰将棋
後手の持駒：なし
  ９ ８ ７ ６ ５ ４ ３ ２ １
+---------------------------+
| ・ ・ ・ ・ ・ ・ ・ ・ ・|一
| ・ ・ ・ ・ ・ ・ ・v玉 ・|二
| ・ ・ ・ ・ ・ ・ ・ ・ ・|三
| ・ ・ ・ ・ ・ ・ ・ ・ ・|四
| ・ ・ ・ ・ ・ ・ ・ ・ ・|五
| ・ ・ ・ ・ ・ ・ ・ ・ ・|六
| ・ ・ ・ ・ ・ ・ ・ ・ ・|七
| ・ ・ ・ ・ ・ ・ ・ ・ ・|八
| ・ ・ ・ ・ ・ ・ ・ ・ ・|九
+---------------------------+
先手の持駒：金　銀
手数----指手---------消費時間--
   1 ２一銀打
   2 １二玉(22)
   3 １一金打
まで3手で詰み`,
  },
];
