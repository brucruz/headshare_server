"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removedAtMongooseField = exports.isActiveMongooseField = void 0;
const isActiveMongooseField = {
  isActive: {
    type: Boolean,
    description: 'Soft delete. Usually when users want to hide something from public view.',
    required: true,
    default: true,
    index: true
  }
};
exports.isActiveMongooseField = isActiveMongooseField;
const removedAtMongooseField = {
  removedAt: {
    type: Date,
    description: 'Hard delete',
    default: null
  }
};
exports.removedAtMongooseField = removedAtMongooseField;