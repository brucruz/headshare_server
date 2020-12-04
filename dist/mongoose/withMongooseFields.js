"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removedAtMongooseField = exports.isActiveMongooseField = void 0;
exports.isActiveMongooseField = {
    isActive: {
        type: Boolean,
        description: 'Soft delete. Usually when users want to hide something from public view.',
        required: true,
        default: true,
        index: true,
    },
};
exports.removedAtMongooseField = {
    removedAt: {
        type: Date,
        description: 'Hard delete',
        default: null,
    },
};
//# sourceMappingURL=withMongooseFields.js.map