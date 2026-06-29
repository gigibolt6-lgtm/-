export type ThemeId = 'sigma' | 'mean' | 'deviation' | 'variance' | 'stdDev';

export interface ThemeDef {
  id: ThemeId;
  title: string;
  description: string;
}

export const THEMES: ThemeDef[] = [
  { id: 'sigma', title: 'Σ 総和', description: 'すべてのデータを足し合わせる記号' },
  { id: 'mean', title: '平均', description: 'データの中心となる値' },
  { id: 'deviation', title: '偏差', description: '各データが平均からどれくらい離れているか' },
  { id: 'variance', title: '分散', description: 'データのばらつきの大きさを表す面積' },
  { id: 'stdDev', title: '標準偏差', description: 'データの標準的なばらつきの距離' },
];

export type Screen = 'menu' | 'learning' | 'quiz';
