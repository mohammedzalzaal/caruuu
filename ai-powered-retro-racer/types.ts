
export enum GameState {
  MainMenu,
  Playing,
  GameOver,
}

export interface Theme {
  skyColor: string;
  roadColor: string;
  stripeColor: string;
  grassColor: string;
  playerCarColor: string;
  opponentCarColors: string[];
}

export interface OpponentCar {
  id: number;
  x: number; // percentage of road width (0-100)
  y: number; // percentage of screen height (0-100)
  color: string;
}
