// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Query} from '@nozbe/watermelondb';
import Model, {Associations} from '@nozbe/watermelondb/Model';

import Channel from '@typings/database/channel';
import GroupsInTeam from '@typings/database/groups_in_team';
import SlashCommand from '@typings/database/slash_command';
import TeamChannelHistory from '@typings/database/team_channel_history';
import TeamMembership from '@typings/database/team_membership';
import TeamSearchHistory from '@typings/database/team_search_history';

/**
 * A Team houses and enables communication to happen across channels and users.
 */
export default class Team extends Model {
    /** table (entity name) : Team */
    static table: string;

    /** associations : Describes every relationship to this entity. */
    static associations: Associations;

    /** allow_open_invite : Boolean flag indicating if this team is open to the public */
    allowOpenInvite: boolean;

    /** description : The description for the team */
    description: string;

    /** display_name : The display name for the team */
    displayName: string;

    /** is_group_constrained : If a team is restricted to 1 or more group(s), this boolean will be true and only members of that group have access to this team. Hence indicating that the members of this team are managed by groups. */
    isGroupConstrained: boolean;

    /** last_team_icon_updated_at : Timestamp for when this team's icon has been updated last */
    lastTeamIconUpdatedAt: number;

    /** name : The name for the team */
    name: string;

    /** type : The type of team ( e.g. open/private ) */
    type: string;

    /** allowed_domains : List of domains that can join this team */
    allowedDomains: string;

    /** channels : All the channels associated with this team */
    channels: Channel[];

    /** groupsInTeam : All the groups associated with this team */
    groupsInTeam: GroupsInTeam[];

    /** myTeam : Lazy query property returning only the team that this user is part of  */
    myTeam: Query<any>;

    /** slashCommands : All the slash commands associated with this team */
    slashCommands: SlashCommand[];

    /** teamChannelHistories : All the channel history with this team */
    teamChannelHistories: TeamChannelHistory[];

    /** members : All the users associated with this team */
    members: TeamMembership[];

    /** teamSearchHistories : All the searches performed on this team */
    teamSearchHistories: TeamSearchHistory[];
}
