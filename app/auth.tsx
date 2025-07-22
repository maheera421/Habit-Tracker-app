import { useAuth } from "@/lib/auth-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { Button, Text, TextInput, useTheme } from 'react-native-paper';


export default function AuthScreen() {
    //defining fucntions to capture user values
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    // to display all types of errors defined in handleAuth()
    const [error, setError] = useState<string | null>("");

    // defining variable for error display styling
    const theme = useTheme()
    const router = useRouter()

    // checks if the user is trying to sign up (false -> sign in)
    const [isSignUp, setIsSignUp] = useState<boolean>(false);

    // to switch between true and false (sign up/sign in pages)
    const handleSwitchMode = () => {
        setIsSignUp((prev) => !prev);
    };

    // to handle authentication functionality
    const handleAuth = async () => {
        if (!email|| !password) {
            setError("Please fill in all fields.");
            return;
        }

        if (password.length<6) {
            setError("Password must be atleast 6 characters or more.");
            return;
        }

        // acutally authenticating by saving user credentials
        setError(null);

        if (isSignUp) {
            const error = await signUp(email, password)
            if (error) {
                setError(error);
                return;
            }
        }
        else {
            const error = await signIn(email, password)
            if (error) {
                setError(error);
                return;
            }

            router.replace("..")
        }
    };

    // actual authentication for auth-context file
    const {signIn, signUp} = useAuth();

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
                    onChangeText={setEmail}
                />

                <TextInput 
                    label="Password" 
                    autoCapitalize="none" 
                    mode="outlined"
                    secureTextEntry
                    style={styles.input}
                    onChangeText={setPassword}
                />

                {error && <Text style={{color: theme.colors.error}}> {error} </Text>}

                <Button mode="contained" style={styles.button} onPress={handleAuth} >
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