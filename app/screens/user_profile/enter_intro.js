import React, {PureComponent} from 'react';
import {TextInput, StyleSheet, View} from 'react-native';
import {

    goToScreen,
    dismissModal,
    setButtons,

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

        const buttons = {
            rightButtons: [this.rightButton],
        };

        setButtons(props.componentId, buttons);
    }

    render() {
        return (
            <View style={style.container}>
                <TextInput
                    style={style.textarea}
                    multiline={true}
                    numberOfLines={4}
                    placeholder='Thêm lời giới thiệu của bạn'
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
