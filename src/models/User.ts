import mongoose, { Schema, model, Document, Types } from 'mongoose';
const mongooseDelete = require('mongoose-delete');

// Giao diện User
export interface IUser extends Document {
    userName: string;
    email: string;
    password: string;
    avatar: string;
    bio: string;
    role: 'user' | 'admin' | 'mod';
    level: number;
    exp: number;
    isVerified: boolean;
    provider: 'local' | 'google' | 'facebook';
    follows: Types.ObjectId[];
    likedComics: Types.ObjectId[];
    history: {
        comic: Types.ObjectId;
        lastViewedAt: Date;
    }[];
    notifications: {
        message: string;
        read: boolean;
        createdAt: Date;
    }[];
    settings: {
        theme: 'light' | 'dark';
        language: string;
    };
    lastLoginAt?: Date;
    deletedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

// Schema
const UserSchema = new Schema<IUser>(
    {
        userName: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
            default: 'https://res.cloudinary.com/dr1vfmngy/image/upload/v1743920443/098062ede8791dc791c3110250d2a413_pfg7rk.jpg',
        },
        bio: {
            type: String,
            default: '',
        },
        role: {
            type: String,
            enum: ['user', 'admin', 'mod'],
            default: 'user',
        },
        level: {
            type: Number,
            default: 1,
        },
        exp: {
            type: Number,
            default: 0,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        provider: {
            type: String,
            enum: ['local', 'google', 'facebook'],
            default: 'local',
        },
        follows: [{
            type: Schema.Types.ObjectId,
            ref: 'User',
            default: [],
        }],
        likedComics: [{
            type: Schema.Types.ObjectId,
            ref: 'Comic',
            default: [],
        }],
        history: [{
            comic: {
                type: Schema.Types.ObjectId,
                ref: 'Comic',
            },
            lastViewedAt: {
                type: Date,
                default: Date.now,
            },
        }],
        notifications: [{
            message: String,
            read: {
                type: Boolean,
                default: false,
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
        }],
        settings: {
            theme: {
                type: String,
                enum: ['light', 'dark'],
                default: 'light',
            },
            language: {
                type: String,
                default: 'vi',
            },
        },
        lastLoginAt: Date,
        deletedAt: Date,
    },
    {
        timestamps: true,
        strict: false
    }
);

// Plugin soft delete
UserSchema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all'
});

export default model<IUser>('User', UserSchema);
