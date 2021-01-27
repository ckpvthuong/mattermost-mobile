// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';

import {General} from '@mm-redux/constants';
import {getCurrentChannel, getMyCurrentChannelMembership, getCurrentChannelStats} from '@mm-redux/selectors/entities/channels';
import {getCurrentTeam} from '@mm-redux/selectors/entities/teams';
import {getTheme} from '@mm-redux/selectors/entities/preferences';
import {getCurrentUserId, getUser} from '@mm-redux/selectors/entities/users';
import {getUserIdFromChannelName, isChannelMuted} from '@mm-redux/utils/channel_utils';

import {isGuest} from 'app/utils/users';

import ChannelTitle from './channel_title';

function mapStateToProps(state) {
    const currentChannel = getCurrentChannel(state);
    const currentTeam = getCurrentTeam(state);
    const currentUserId = getCurrentUserId(state);
    const myChannelMember = getMyCurrentChannelMembership(state);
    const stats = getCurrentChannelStats(state) || {member_count: 0, guest_count: 0};

    let isTeammateGuest = false;
    let isSelfDMChannel = false;
    if (currentChannel && currentChannel.type === General.DM_CHANNEL) {
        const teammateId = getUserIdFromChannelName(currentUserId, currentChannel.name);
        const teammate = getUser(state, teammateId);
        isTeammateGuest = isGuest(teammate);
        isSelfDMChannel = currentUserId === currentChannel.teammate_id;
    }

    return {
        isSelfDMChannel,
        currentChannelName: currentChannel ? currentChannel.display_name + ` ( ${currentTeam.display_name} )`: '',
        isArchived: currentChannel ? currentChannel.delete_at !== 0 : false,
        displayName: state.views.channel.displayName,
        channelType: currentChannel?.type,
        isChannelMuted: isChannelMuted(myChannelMember),
        theme: getTheme(state),
        isGuest: isTeammateGuest,
        hasGuests: stats.guest_count > 0,
    };
}

export default connect(mapStateToProps)(ChannelTitle);
