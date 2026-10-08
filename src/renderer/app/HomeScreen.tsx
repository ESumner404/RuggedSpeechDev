export type HomeTileId = 'talk' | 'keyboard' | 'myday' | 'favourites' | 'mypages' | 'feelings';

type Tile = { id: HomeTileId; label: string };

// Fixed order top-to-bottom, left-to-right, this position is load-bearing
// motor memory (invariant I3), so it must never depend on data.
const TILES: Tile[] = [
  { id: 'talk', label: 'Talk' },
  { id: 'keyboard', label: 'Keyboard' },
  { id: 'myday', label: 'My Day' },
  { id: 'favourites', label: 'Favourites' },
  { id: 'mypages', label: 'My Pages' },
  { id: 'feelings', label: 'Feelings & Help' },
];

type Props = {
  onSelect: (tile: HomeTileId) => void;
};

export function HomeScreen({ onSelect }: Props) {
  return (
    <div class="home-screen">
      {TILES.map((tile) => (
        <button
          type="button"
          class="home-screen__tile"
          key={tile.id}
          data-tile={tile.id}
          onClick={() => onSelect(tile.id)}
        >
          {tile.label}
        </button>
      ))}
    </div>
  );
}
