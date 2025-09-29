import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserProvider } from "./user";
import ToastManager from "toastify-react-native";
import { toastConfig } from "@/hooks/useToast";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PostHogProvider, } from 'posthog-react-native'
import { CopilotProvider } from "react-native-copilot";

export default function AppProviders({ children }) {
    const queryClient = new QueryClient();

    return (
        <PostHogProvider apiKey="phc_McsRD1Ut1xS9Hf0HYZIqS4OJxNQlw5bdbnCw7SeqckX" options={{
            host: "https://us.i.posthog.com",

        }}>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <QueryClientProvider client={queryClient}>
                    <UserProvider>
                        <CopilotProvider 
                         labels={{
                            previous: "Anterior",
                            next: "Próximo",
                            skip: "Pular",
                            finish: "Finalizar"
                          }}
                        >
                            {children}
                            <ToastManager
                                position="bottom"
                                duration={2000}
                                showCloseIcon={false}
                                autoHide={true}
                                showProgressBar={false}
                                animationStyle="fade"
                                bottomOffset={50}
                                config={toastConfig}
                            />
                        </CopilotProvider>
                    </UserProvider>
                </QueryClientProvider>
            </GestureHandlerRootView>
        </PostHogProvider>
    );
};
