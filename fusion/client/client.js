import '../../common/livedata_connection';
// Initialize the default server connection and put it on Meteor.connection
import { DDP, LivedataTest } from '../../common/namespace';

import FusionModel from './fusion';

import { engage, disengage } from './engager';

const isTesting = Meteor.isTest;
const isDevelopment = Meteor.isDevelopment;

if (isTesting || isDevelopment || process.env.DDP_AUTOENGAGE) {
  engage();
} else {
  disengage();
}

DDP.engage = engage;
DDP.disengage = disengage;

const Fusion = new FusionModel();

export { DDP, LivedataTest, Fusion };
