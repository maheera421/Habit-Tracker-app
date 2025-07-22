import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from 'react-native-paper';


export default function AuthScreen() {
    // checks if the user is trying to sign up (false -> sign in)
    const [isSignUp, setIsSignUp] = useState<boolean>(false);

    // to switch between true and false (sign up/sign in pages)
    const handleSwitchMode = () => {
        setIsSignUp((prev) => !prev);
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.content} >
                <Text style={styles.title} variant='headlineMedium'> {isSignUp ? "Create Account" : "Welcome Back"}</Text>

                <TextInput 
                    label="Email" 
                    autoCapitalize="none" 
                    keyboardType="email-address"
                    placeholder="example@gmail.com"
                    mode="outlined"
                    style={styles.input}
                />

                <TextInput 
                    label="Email" 
                    autoCapitalize="none" 
                    keyboardType="email-address"
                    mode="outlined"
                    style={styles.input}
                />

                <Button mode="contained" style={styles.button}>
                    {isSignUp ? "Sign Up" : "Sign In"}
                </Button>

                <Button mode="text" onPress={handleSwitchMode} style={styles.switchModeButton}>
                    {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up."}
                </Button>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5'
    },
    content: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
    },
    title: {
        textAlign: 'center',
        marginBottom: 24,
    },
    input: {
        marginBottom: 16,
    },
    button: {
        marginTop: 8,
    },
    switchModeButton: {
        marginTop: 16,
    },
});