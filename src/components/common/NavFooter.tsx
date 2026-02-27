import { useAuth } from "@/src/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export function NavFooter() {
    const router = useRouter()
    const pathName = usePathname();
    const { user} = useAuth();

    function getColor(route: string) {
        return pathName.startsWith(route) ? "#FBBC04" : "#DDD"
    }
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => router.push("/home")}>
                <Ionicons name="grid" size={26} color={getColor("/home")}></Ionicons>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/favorites")}>
                <Ionicons name="bookmark" size={26} color={getColor("/favorites")}></Ionicons>
            </TouchableOpacity>

            <TouchableOpacity>
                <Ionicons name="person" size={26} color="#DDD"></Ionicons>
            </TouchableOpacity>

            {user?.role === "ADMIN" && (
                <TouchableOpacity onPress={() => router.push("/admin/manage")}>
                    <Ionicons name="construct" size={24} color={"#DDD"}></Ionicons>
                </TouchableOpacity>
            )}

        </View>

)}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        height: 80,
        backgroundColor: "#FFF",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        paddingHorizontal: 24,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: -6},
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 10,
        
    }
})