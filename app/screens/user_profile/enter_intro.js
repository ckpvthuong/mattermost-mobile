// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import React, {PureComponent} from 'react';
import {TextInput, StyleSheet, View, Alert} from 'react-native';
import {preventDoubleTap} from 'app/utils/tap';
import {

    goToScreen,
    dismissModal,
    setButtons,
    popTopScreen,
    dismissAllModalsAndPopToRoot,
} from '@actions/navigation';

import {Navigation} from 'react-native-navigation';

export default class EnterIntro extends PureComponent {
    rightButton = {
        id: 'save',
        showAsAction: 'always',
        text: 'Lưu',
        color: 'white',
    };

    constructor(props) {
        super(props);
        this.intro = !props.editStatus ? props.currentUser.introduce :
            props.currentUser.status_string;
        const buttons = {
            rightButtons: [this.rightButton],
        };

        setButtons(props.componentId, buttons);
    }
    componentDidMount() {
        this.navigationEventListener = Navigation.events().bindComponent(this);
    }

    submitUser = preventDoubleTap(async () => {
        const infoUpdate = !this.props.editStatus ? {introduce: this.intro} :
            {status_string: this.intro};
        const {error} = await this.props.updateUser(infoUpdate);
        if (error) {
            this.handleRequestError(error);
            return;
        }
        popTopScreen();
    })

    navigationButtonPressed({buttonId}) {
        switch (buttonId) {
        case 'save':
            this.submitUser();
            break;
        case 'close-settings':
            this.close();
            break;
        }
    }

    handleRequestError = (error) => {
        Alert.alert(error.message);
    }
    render() {
        return (
            <View style={style.container}>
                <TextInput
                    style={style.textarea}
                    multiline={true}
                    numberOfLines={4}
                    placeholder={this.intro === '' ? 'Thêm lời giới thiệu của bạn' : null}
                    onChangeText={(text) => {
                        this.intro = text;
                    }}
                    defaultValue={this.intro}
                />
            </View>
        );
    }
}

const style = StyleSheet.create({
    container: {

        marginTop: 20,
        marginHorizontal: 20,
    },
    textarea: {
        height: '50%',
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        fontSize: 18,
    },
});
