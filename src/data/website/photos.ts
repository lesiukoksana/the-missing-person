import type { EvidenceId } from '../evidence';

export interface MetadataRow {
  field: string;
  value: string;
}

export interface Hotspot {
  id: string;
  /** Position and size, as a percentage of the image. */
  x: number;
  y: number;
  width: number;
  height: number;
  /** How far the player must zoom before it can be examined. */
  minZoom: number;
  label: string;
  note: string;
  evidence?: EvidenceId;
}

export interface Photo {
  id: string;
  title: string;
  date: string;
  description: string;
  alt: string;
  fileName: string;
  metadata: MetadataRow[];
  hotspots?: Hotspot[];
  /** Eggs and puzzles are switched on by these markers. */
  hasMetadataPuzzle?: boolean;
  hasCroppedThumbnail?: boolean;
}

function cameraMetadata(
  fileName: string,
  taken: string,
  dimensions: string,
  extra: MetadataRow[] = [],
): MetadataRow[] {
  return [
    { field: 'FileName', value: fileName },
    { field: 'Make', value: 'Halden' },
    { field: 'Model', value: 'K-40' },
    { field: 'DateTimeOriginal', value: taken },
    { field: 'ImageSize', value: dimensions },
    ...extra,
  ];
}

export const PHOTOS: Photo[] = [
  {
    id: 'weir-bridge',
    title: 'Weir Bridge, first light',
    date: '2 April 2012',
    description: 'Got up at five for this and the light lasted about four minutes.  Worth it.  Do not tell anyone I said so.',
    alt: 'A stone arched bridge over a calm river at dawn, with a low weir beyond it.',
    fileName: 'weir_bridge_01.jpg',
    metadata: cameraMetadata('weir_bridge_01.jpg', '2012:04:02 06:12:44', '1600 x 1200'),
  },
  {
    id: 'yellow-house',
    title: 'The yellow house',
    date: '23 September 2012',
    description: 'Mine is the top window.  The slight lean is the house, not the photographer.',
    alt: 'A narrow yellow terraced house with a small window under the roof.',
    fileName: 'yellow_house.jpg',
    metadata: cameraMetadata('yellow_house.jpg', '2012:09:23 16:40:02', '1600 x 1200'),
  },
  {
    id: 'mill-road',
    title: 'Harrow Mill from Mill Road',
    date: '16 March 2013',
    description: 'Five floors, one chimney, no glass to speak of.  The phone box is the only thing on the road still working.',
    alt: 'A long, dark mill building with rows of empty windows and a tall chimney. A phone box stands on the road in front.',
    fileName: 'harrow_01.jpg',
    metadata: cameraMetadata('harrow_01.jpg', '2013:03:16 11:03:51', '1600 x 1200'),
    hotspots: [
      {
        id: 'phone-box',
        x: 8,
        y: 62,
        width: 8,
        height: 24,
        minZoom: 2,
        label: 'The phone box',
        note: 'A public phone box on Mill Road, right opposite the gate.',
      },
    ],
  },
  {
    id: 'wheel-house',
    title: 'Wheel house, upper gallery',
    date: '6 April 2013',
    description: 'The light comes through at about three in the afternoon.  North side only, I was told, and I am doing as I was told.',
    alt: 'The inside of a stone room. A timber gallery runs around the wall above a pit of black water.',
    fileName: 'harrow_07.jpg',
    metadata: cameraMetadata('harrow_07.jpg', '2013:04:06 15:02:17', '1600 x 1200'),
    hotspots: [
      {
        id: 'east-boards',
        x: 66,
        y: 30,
        width: 31,
        height: 16,
        minZoom: 2,
        label: 'The east end of the gallery',
        note: 'The boards here are darker and have sagged. A support has rotted through. This was before any fire.',
      },
      {
        id: 'culvert',
        x: 40,
        y: 78,
        width: 18,
        height: 16,
        minZoom: 2,
        label: 'The culvert',
        note: 'A low stone mouth at the waterline. It would lead out to the river.',
      },
    ],
  },
  {
    id: 'pellets',
    title: 'Pellets',
    date: '6 April 2013',
    description: 'This is what passes for a thrilling discovery around here.  Owl pellets, wheel house floor.  Each one has a whole small tragedy inside.',
    alt: 'Dark oval owl pellets lying on a wooden beam next to a coin for scale.',
    fileName: 'harrow_09.jpg',
    metadata: cameraMetadata('harrow_09.jpg', '2013:04:06 15:20:40', '1600 x 1200'),
  },
  {
    id: 'blue-hour',
    title: 'Blue hour, Harrow Mill',
    date: 'October 2013',
    description: 'Went back for the evening light.  There was hardly anyone about.',
    alt: 'A blue-tinted, grainy view across the mill yard at night. A person in a long coat is carrying a torch. A car is at the gate.',
    fileName: 'harrow_blue.jpg',
    metadata: [
      { field: 'FileName', value: 'harrow_blue.jpg' },
      { field: 'Make', value: 'TrailEye' },
      { field: 'Model', value: 'TC-12' },
      { field: 'DateTimeOriginal', value: '2013:11:15 02:52:07' },
      { field: 'ImageSize', value: '1280 x 960 (cropped from 1280 x 1024)' },
      { field: 'Software', value: 'GIMP 2.8.10' },
      { field: 'ModifyDate', value: '2014:10:14 22:31:18' },
    ],
    hasMetadataPuzzle: true,
    hotspots: [
      {
        id: 'figure',
        x: 44,
        y: 44,
        width: 13,
        height: 38,
        minZoom: 2,
        label: 'The figure',
        note: 'An adult in a long coat with a torch, walking towards the mill. Too blurred to make out a face.',
      },
      {
        id: 'car',
        x: 3,
        y: 66,
        width: 30,
        height: 22,
        minZoom: 4,
        label: 'The car at the gate',
        note: 'A dark estate car with its lights on. Part of the number plate is legible: FX09 R…',
        evidence: 'plate-partial',
      },
    ],
  },
  {
    id: 'bonfire',
    title: 'Bonfire night',
    date: '5 November 2013',
    description: 'Ashford Rugby Club’s annual attempt to burn down Ashford Rugby Club.  Sarah took this one.  I look happy, so it must have been early on.',
    alt: 'A woman in silhouette in front of a large bonfire, looking at something out of frame.',
    fileName: 'bonfire_13.jpg',
    metadata: [
      ...cameraMetadata('bonfire_13.jpg', '2013:11:05 19:48:30', '1200 x 900 (cropped from 1600 x 1200)'),
      { field: 'Software', value: 'GIMP 2.8.14' },
      { field: 'ModifyDate', value: '2015:02:17 01:12:09' },
    ],
    hasCroppedThumbnail: true,
  },
  {
    id: 'loft-afterwards',
    title: 'The loft, afterwards',
    date: '23 November 2013',
    description: 'From the yard.',
    alt: 'Burnt roof timbers standing against a pale, empty sky.',
    fileName: 'harrow_after.jpg',
    metadata: cameraMetadata('harrow_after.jpg', '2013:11:23 13:15:22', '1600 x 1200'),
  },
  {
    id: 'heritage-day',
    title: 'Heritage Day',
    date: '13 September 2014',
    description: 'They got the 1952 fire engine out of the museum and let children climb on it.  Bunting everywhere.  Everyone in town was there, including half of Westmarch Constabulary.',
    alt: 'An old fire engine under strings of bunting, in sunshine. A dark estate car is parked behind it.',
    fileName: 'heritage_14.jpg',
    metadata: cameraMetadata('heritage_14.jpg', '2014:09:13 12:21:09', '1600 x 1200'),
    hotspots: [
      {
        id: 'estate-car',
        x: 60,
        y: 52,
        width: 36,
        height: 30,
        minZoom: 4,
        label: 'The car behind the engine',
        note: 'A dark estate car parked behind the engine. The number plate reads FX09 RDT.',
        evidence: 'plate-heritage',
      },
    ],
  },
  {
    id: 'weir-in-spate',
    title: 'The weir, in spate',
    date: '15 October 2014',
    description: 'Three days of this to come.  You cannot see the steps at all.',
    alt: 'A brown, fast-flowing river pouring over a weir in heavy rain.',
    fileName: 'weir_oct14.jpg',
    metadata: cameraMetadata('weir_oct14.jpg', '2014:10:15 17:52:33', '1600 x 1200'),
  },
];

export const PHOTOS_BY_ID = Object.fromEntries(PHOTOS.map((photo) => [photo.id, photo]));

export interface OwlFrame {
  id: string;
  fileName: string;
  taken: string;
  stamp: string;
  caption: string;
  alt: string;
  owlX: number;
  owlCount: 0 | 1 | 2;
}

export const OWL_FRAMES: OwlFrame[] = [
  {
    id: 'TE_0041',
    fileName: 'TE_0041.JPG',
    taken: '2013:06:28 21:44:12',
    stamp: '2013-06-28 21:44',
    caption: 'First one!  Look at that face.  Look at how unimpressed it is.',
    alt: 'An infrared image of a barn owl on a beam, looking at the camera.',
    owlX: 260,
    owlCount: 1,
  },
  {
    id: 'TE_0117',
    fileName: 'TE_0117.JPG',
    taken: '2013:08:02 22:10:51',
    stamp: '2013-08-02 22:10',
    caption: 'Both of them.  I have decided these are Margaret and Keith.',
    alt: 'An infrared image of two barn owls side by side on a beam.',
    owlX: 340,
    owlCount: 2,
  },
  {
    id: 'TE_0203',
    fileName: 'TE_0203.JPG',
    taken: '2013:10:09 23:37:05',
    stamp: '2013-10-09 23:37',
    caption: 'Keith.  Or possibly Margaret.  Last good one from this card.',
    alt: 'An infrared image of a barn owl at the far end of a beam.',
    owlX: 520,
    owlCount: 1,
  },
  {
    id: 'TE_0088',
    fileName: 'TE_0088.JPG',
    taken: '2014:04:19 20:58:44',
    stamp: '2014-04-19 20:58',
    caption: 'New card, new season.  They came back.  I did not think they would.',
    alt: 'An infrared image of a barn owl on a charred beam.',
    owlX: 180,
    owlCount: 1,
  },
  {
    id: 'TE_0412',
    fileName: 'TE_0412.JPG',
    taken: '2014:06:30 22:21:17',
    stamp: '2014-06-30 22:21',
    caption: 'Margaret, furious, about nothing.',
    alt: 'An infrared image of a barn owl with its wings half open.',
    owlX: 410,
    owlCount: 1,
  },
  {
    id: 'TE_0655',
    fileName: 'TE_0655.JPG',
    taken: '2014:08:24 21:03:39',
    stamp: '2014-08-24 21:03',
    caption: 'An empty beam.  Sometimes that is the picture.',
    alt: 'An infrared image of an empty beam.',
    owlX: 0,
    owlCount: 0,
  },
];

/** Egg 7. Only reachable after viewing every frame above. Part of the unexplained remainder. */
export const HIDDEN_FRAME: OwlFrame = {
  id: 'TE_0917',
  fileName: 'TE_0917.JPG',
  taken: '2014:10:18 04:12:26',
  stamp: '2014-10-18 04:12',
  caption: '',
  alt: 'An infrared image of the mill yard at night. A small figure without a coat is walking away from the culvert.',
  owlX: 0,
  owlCount: 0,
};
