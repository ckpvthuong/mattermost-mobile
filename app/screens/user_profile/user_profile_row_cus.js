// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import PropTypes from 'prop-types';
import {
    Switch,
    Text,
    View,
} from 'react-native';

import CompassIcon from '@components/compass_icon';
import FormattedText from '@components/formatted_text';
import TouchableWithFeedback from '@components/touchable_with_feedback';
import {makeStyleSheetFromTheme} from '@utils/theme';

const createStyleSheet = makeStyleSheetFromTheme((theme) => {
    return {
        container: {
            backgroundColor: theme.centerChannelBg,
            paddingHorizontal: 15,
            flexDirection: 'row',
            alignItems: 'center',
        },
        detail: {
            //marginHorizontal: 15,
            color: 'rgba(0, 0, 0, 0.5)',
            fontSize: 15,
        },
        label: {
            //flex: 1,
            //marginLeft: 6,
            fontSize: 15,
            fontWeight: '600',
            paddingVertical: 15,
            color: theme.buttonBg,
        },
        leftIcon: {
            color: theme.buttonBg,
            marginRight: 4
        },
        rightIcon: {
            color: theme.centerChannelColor,
            opacity: 0.7,
        },
        wrapper: {
            backgroundColor: '#ddd',
        },
    };
});

function createTouchableComponent(children, action) {
    return (
        <TouchableWithFeedback onPress={action}>
            {children}
        </TouchableWithFeedback>
    );
}

function userProfileRow(props) {
    const {action, defaultMessage, detail, icon, textId, togglable, theme, iconSize, shouldRender = true} = props;

    if (!shouldRender) {
        return null;
    }

    const style = createStyleSheet(theme);

    const iconComponent = (
        <CompassIcon
            name={icon}
            size={iconSize}
            style={style.leftIcon}
        />
    );

    const RowComponent = (
        <View style={style.wrapper}>
            <View style={style.container}>
                {iconComponent}
                <FormattedText
                    style={[style.label]}
                    id={textId}
                    defaultMessage={defaultMessage}
                />
                <Text style={style.detail}>{detail}</Text>
                {togglable &&
                <Switch
                    onValueChange={action}
                    value={detail}
                />
                }
            </View>
        </View>
    );

    if (togglable) {
        return RowComponent;
    }

    return createTouchableComponent(RowComponent, action);
}

userProfileRow.propTypes = {
    action: PropTypes.func.isRequired,
    defaultMessage: PropTypes.string.isRequired,
    detail: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.bool,
    ]),
    icon: PropTypes.string.isRequired,
    iconColor: PropTypes.string,
    iconSize: PropTypes.number,
    textId: PropTypes.string.isRequired,
    togglable: PropTypes.bool,
    textColor: PropTypes.string,
    theme: PropTypes.object.isRequired,
};

userProfileRow.defaultProps = {
    iconColor: 'rgba(0, 0, 0, 0.7)',
    iconSize: 15,
    textColor: '#000',
    togglable: false,
};

export default userProfileRow;
