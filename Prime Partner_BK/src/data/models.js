import { fk, attr, Model } from 'redux-orm';
//-------------------------------------------------------

/**
 * Model For User.
 */
class User extends Model {
  toString() {
    return `User: ${this.name}`;
  }
  normalize() {
    return  {
      User: this.User.ref
    };
  }
}
User.modelName = 'User';
User.fields = {
  AccountID : attr(),
  AccountTypeID : attr(),
  mobile : attr(),
  password : attr(),
  Balance : attr(),
  ChemistCardNo : attr(),
  DaysRemainingforNextTier : attr(),
  LastTierUpgradeDate : attr(),
  Membership : attr(),
  NextTierLevel : attr(),
  Output : attr(),
  Points : attr(),
  PointsEarned : attr(),
  PointsRequired : attr(),
  TotalEarnPoint : attr(),
  TotalExpiredPoint : attr(),
  TotalSpentPoint : attr(),
  UpdatedBy : attr(),
  UpdatedOn : attr(),
  CreatedBy : attr(),
  login : attr(),
  createdDatetime : attr(),
  modifiedDatetime : attr(),
};


export { User, };
