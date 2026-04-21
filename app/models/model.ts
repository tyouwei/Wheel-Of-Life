export type Realm = {
  name: string;
  color: string;
  bg: string;
};

export type MapRealm = Pick<Realm, 'name' | 'color'>;

export type Team = {
  name: string;
  merit: number;
  wisdom: number;
  realm: string;
};

export type RankColors = {
  bg: string;
  hoverBg: string;
  rankBg: string;
  rankColor: string;
  nameColor: string;
};

export type RowProps = {
  team: Team;
  rank: number;
  index: number;
  realm: Realm;
  isLast: boolean;
  onRowClick: (realmName: string) => void;
};
