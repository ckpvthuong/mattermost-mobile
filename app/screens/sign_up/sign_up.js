// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {intlShape} from 'react-intl';
import {
    ActivityIndicator,
    Dimensions,
    Image,
    InteractionManager,
    Keyboard,
    StyleSheet,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import Button from 'react-native-button';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Alert} from 'react-native';

import {resetToChannel, goToScreen, popTopScreen} from '@actions/navigation';
import ErrorText from '@components/error_text';
import FormattedText from '@components/formatted_text';
import StatusBar from '@components/status_bar';
import {t} from '@utils/i18n';
import {preventDoubleTap} from '@utils/tap';
import {changeOpacity} from '@utils/theme';
import tracker from '@utils/time_tracker';

import mattermostManaged from 'app/mattermost_managed';
import {GlobalStyles} from 'app/styles';
import telemetry from 'app/telemetry';
import {Client4} from '@mm-redux/client';

export default class SignUp extends PureComponent {
    static propTypes = {
        config: PropTypes.object.isRequired,
        license: PropTypes.object.isRequired,
    };

    static contextTypes = {
        intl: intlShape.isRequired,
    };

    constructor(props) {
        super(props);

        this.emailRef = React.createRef();
        this.passwordRef = React.createRef();
        this.confirmPasswordRef = React.createRef();
        this.firstNameRef = React.createRef();
        this.lastNameRef = React.createRef();
        
        this.email = ''
        this.password = '';
        this.confirmPassword = '';
        this.firstName = '';
        this.lastName = '';
        
        this.scroll = React.createRef();

        this.state = {
            error: null,
            isLoading: false,
        };
    }

    componentDidMount() {
        Dimensions.addEventListener('change', this.orientationDidChange);
    }

    componentWillUnmount() {
        Dimensions.removeEventListener('change', this.orientationDidChange);
    }

    blur = () => {
        if (this.emailRef.current) {
            this.emailRef.current.blur();
        }

        if (this.passwordRef.current) {
            this.passwordRef.current.blur();
        }

        if (this.confirmPasswordRef.current) {
            this.confirmPasswordRef.current.blur();
        }

        if (this.firstNameRef.current) {
            this.firstNameRef.current.blur();
        }

        if (this.lastNameRef.current) {
            this.lastNameRef.current.blur();
        }

        Keyboard.dismiss();
    };

    checkSignUpResponse = (data) => {
        
        if (data?.error) {
            this.setState({
                error: this.getSignUpErrorMessage(data.error),
                isLoading: false,
            });
            return false;
        }

        this.setState({isLoading: false});
        return true;
    };

    

    getSignUpErrorMessage = (error) => {
        return (
            this.getServerErrorForSignUp(error) ||
            this.state.error
        );
    };

    login = () => {
        const {intl} = this.context;
        const screen = 'Login';
        const title = intl.formatMessage({id: 'login.title', defaultMessage: 'Log in'});

        goToScreen(screen, title);
    }

    getServerErrorForSignUp = (error) => {
        if (!error) {
            return null;
        }
        const errorId = error.server_error_id;
        if (!errorId) {
            return error.message;
        }
        console.log(errorId)
        if (
            errorId === 'app.user.save.email_exists.app_error'
        ) {
            return {
                intl: {
                    id: t('signup.emailExists'),
                    defaultMessage: "Email exists!.",
                },
            };
        } else if (
            errorId === 'model.user.is_valid.pwd.app_error'
        ) {
            return {
                intl: {
                    id: t('signup.invalidPassword'),
                    defaultMessage: 'Your password is incorrect.',
                },
            };
        }
        return error.message;
    };

    handleEmailChange = (text) => {
        this.email = text;
    };

    handlePasswordChange = (text) => {
        this.password = text;
    };

    handleConfirmPasswordChange = (text) => {
        this.confirmPassword = text;
    };

    handleFirstNameChange = (text) => {
        this.firstName = text;
    };

    handleLastNameChange = (text) => {
        this.lastName = text;
    };

    orientationDidChange = () => {
        if (this.scroll.current) {
            this.scroll.current.scrollTo({x: 0, y: 0, animated: true});
        }
    };

    passwordFocus = () => {
        if (this.passwordRef.current) {
            this.passwordRef.current.focus();
        }
    };

    confirmPasswordFocus = () => {
        if (this.confirmPasswordRef.current) {
            this.confirmPasswordRef.current.focus();
        }
    };

    firstNameFocus = () => {
        if (this.firstNameRef.current) {
            this.firstNameRef.current.focus();
        }
    };

    lastNameFocus = () => {
        if (this.lastNameRef.current) {
            this.lastNameRef.current.focus();
        }
    };

    preSignUp = preventDoubleTap(() => {
        this.setState({error: null, isLoading: true});
        Keyboard.dismiss();
        InteractionManager.runAfterInteractions(async () => {
            if (!this.email) {
                t('signup.noEmail');

                // it's slightly weird to be constructing the message ID, but it's a bit nicer than triply nested if statements
                let msgId = 'signup.no';
                if (this.props.config.EnableSignUpWithEmail === 'true') {
                    msgId += 'Email';
                }

                this.setState({
                    isLoading: false,
                    error: {
                        intl: {
                            id: msgId,
                            defaultMessage: '',
                            values: {
                            },
                        },
                    },
                });
                return;
            }

            if (!this.password) {
                this.setState({
                    isLoading: false,
                    error: {
                        intl: {
                            id: t('signup.noPassword'),
                            defaultMessage: 'Please enter your password',
                        },
                    },
                });
                return;
            }

            // if (!this.currentPassword) {
            //     this.setState({
            //         isLoading: false,
            //         error: {
            //             intl: {
            //                 id: t('signup.noConfirmPassword'),
            //                 defaultMessage: 'Please enter your confirm password',
            //             },
            //         },
            //     });
            //     return;
            // }

            if (!this.firstName) {
                this.setState({
                    isLoading: false,
                    error: {
                        intl: {
                            id: t('signup.noFirstName'),
                            defaultMessage: 'Please enter your first name',
                        },
                    },
                });
                return;
            }

            if (!this.lastName) {
                this.setState({
                    isLoading: false,
                    error: {
                        intl: {
                            id: t('signup.noLastName'),
                            defaultMessage: 'Please enter your last name',
                        },
                    },
                });
                return;
            }

            this.signUp();
        });
    });


    signUp = async () => {
        const {isLoading} = this.state;
        if (isLoading) {

            let username = makeUsername(this.firstName+this.lastName);
            let count = 0;

            while(true){
                try { 
                    username = count == 0 ? username : username + count;
                    
                    await Client4.getUserByUsername(username);
                    
                    count++;
                    
                } catch (error) {
                                     
                    break;
                }
            }


            const userProfile = {
                email: this.email,
                username: username,
                password: this.password,
                first_name: this.firstName,
                last_name: this.lastName
            }
            
            let result;

            try {
                result = await Client4.createUser(userProfile);
            } catch (error) {
                result = {error}
            }

            if (this.checkSignUpResponse(result)) {
                this.handleAlert();
            }
        }
    };

    handleAlert = () => {
        const {intl} = this.context;
        const screen = 'Login';
        const title = intl.formatMessage({id: 'login.title', defaultMessage: 'Log in'});

        const successTitle = intl.formatMessage({id: 'signup.success', defaultMessage: 'Success'});
        const successMess = intl.formatMessage({id: 'signup.checkEmail', defaultMessage: 'Please check your email to complete sign up'});
        
        Alert.alert(
                successTitle, 
                successMess, 
                [{text: 'OK', onPress: () => goToScreen(screen,title)}] );
    }

    render() {
        const {isLoading} = this.state;

        let proceed;
        if (isLoading) {
            proceed = (
                <ActivityIndicator
                    animating={true}
                    size='small'
                />
            );
        } else {
            const additionalStyle = {};
            if (this.props.config.EmailLoginButtonColor) {
                additionalStyle.backgroundColor = this.props.config.EmailLoginButtonColor;
            }
            if (this.props.config.EmailLoginButtonBorderColor) {
                additionalStyle.borderColor = this.props.config.EmailLoginButtonBorderColor;
            }

            const additionalTextStyle = {};
            if (this.props.config.EmailLoginButtonTextColor) {
                additionalTextStyle.color = this.props.config.EmailLoginButtonTextColor;
            }

            proceed = (
                <Button
                    onPress={this.preSignUp}
                    containerStyle={[GlobalStyles.signupButton, additionalStyle]}
                >
                    <FormattedText
                        id='signup'
                        defaultMessage='Đăng ký'
                        style={[GlobalStyles.signupButtonText, additionalTextStyle]}
                    />
                </Button>
            );
        }

        let login;
        if (this.props.config.EnableSignInWithEmail === 'true') {
            login = (
                <Button
                    onPress={this.login}
                    containerStyle={[style.forgotPasswordBtn]}
                >
                    <FormattedText
                        id='login'
                        defaultMessage='Log in'
                        style={style.forgotPasswordTxt}
                    />
                </Button>
            );
        }

        return (
            <SafeAreaView style={style.container}>
                <StatusBar/>
                <TouchableWithoutFeedback
                    onPress={this.blur}
                    accessible={false}
                >
                    <KeyboardAwareScrollView
                        ref={this.scrollRef}
                        style={style.container}
                        contentContainerStyle={style.innerContainer}
                        keyboardShouldPersistTaps='handled'
                        enableOnAndroid={true}
                    >
                        <Image
                            source={require('@assets/images/logo.png')}
                            style={{height: 72, resizeMode: 'contain'}}
                        />
                        <View>
                            <Text style={GlobalStyles.header}>
                                {this.props.config.SiteName}
                            </Text>
                            <FormattedText
                                style={GlobalStyles.subheader}
                                id='web.root.signup_info'
                                defaultMessage='All team communication in one place, searchable and accessible anywhere'
                            />
                        </View>
                        <ErrorText
                            error={this.state.error}
                        />
                        <TextInput
                            autoCapitalize='none'
                            autoCorrect={false}
                            blurOnSubmit={false}
                            disableFullscreenUI={true}
                            keyboardType='email-address'
                            onChangeText={this.handleEmailChange}
                            onSubmitEditing={this.firstNameFocus}
                            placeholder="Email"
                            placeholderTextColor={changeOpacity('#000', 0.5)}
                            ref={this.emailRef}
                            returnKeyType='next'
                            style={GlobalStyles.inputBox}
                            underlineColorAndroid='transparent'
                        />
                        <TextInput
                            autoCapitalize='none'
                            autoCorrect={false}
                            blurOnSubmit={false}
                            disableFullscreenUI={true}
                            keyboardType='email-address'
                            onChangeText={this.handleFirstNameChange}
                            onSubmitEditing={this.lastNameFocus}
                            placeholder={this.context.intl.formatMessage({id: 'signup.firstname', defaultMessage: 'First Name'})}
                            placeholderTextColor={changeOpacity('#000', 0.5)}
                            ref={this.firstNameRef}
                            returnKeyType='next'
                            style={GlobalStyles.inputBox}
                            underlineColorAndroid='transparent'
                        />
                        <TextInput
                            autoCapitalize='none'
                            autoCorrect={false}
                            blurOnSubmit={false}
                            disableFullscreenUI={true}
                            keyboardType='email-address'
                            onChangeText={this.handleLastNameChange}
                            onSubmitEditing={this.passwordFocus}
                            placeholder={this.context.intl.formatMessage({id: 'signup.lastname', defaultMessage: 'Last Name'})}
                            placeholderTextColor={changeOpacity('#000', 0.5)}
                            ref={this.lastNameRef}
                            returnKeyType='next'
                            style={GlobalStyles.inputBox}xs
                            underlineColorAndroid='transparent'
                        />
                        <TextInput
                            autoCapitalize='none'
                            autoCorrect={false}
                            disableFullscreenUI={true}
                            onChangeText={this.handlePasswordChange}
                            onSubmitEditing={this.preSignUp}
                            style={GlobalStyles.inputBox}
                            placeholder={this.context.intl.formatMessage({id: 'signup.password', defaultMessage: 'Password'})}
                            placeholderTextColor={changeOpacity('#000', 0.5)}
                            ref={this.passwordRef}
                            returnKeyType='go'
                            secureTextEntry={true}
                            underlineColorAndroid='transparent'
                        />
                        {proceed}
                        
                    </KeyboardAwareScrollView>
                </TouchableWithoutFeedback>
            </SafeAreaView>
        );
    }
}

const style = StyleSheet.create({
    container: {
        flex: 1,
    },
    innerContainer: {
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingHorizontal: 15,
        paddingVertical: 50,
    },
    forgotPasswordBtn: {
        borderColor: 'transparent',
        marginTop: 15,
    },
    forgotPasswordTxt: {
        color: '#2389D7',
    },
});

function removeAccents(str) {
    return str.normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .replace(/đ/g, 'd').replace(/Đ/g, 'D');
}

function makeUsername(str) {
    return removeAccents(str).split(" ").join("").toLowerCase();
}

