// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {AppSchema, appSchema} from '@nozbe/watermelondb';

import {
    CustomEmojiSchema,
    DraftSchema,
    FileSchema,
    PostInThreadSchema,
    PostMetadataSchema,
    PostSchema,
    RoleSchema,
    SystemSchema,
    TermsOfServiceSchema,
} from './table_schemas';

export const serverSchema: AppSchema = appSchema({
    version: 1,
    tables: [
        CustomEmojiSchema,
        DraftSchema,
        FileSchema,
        PostInThreadSchema,
        PostMetadataSchema,
        PostSchema,
        RoleSchema,
        SystemSchema,
        TermsOfServiceSchema,
    ],
});