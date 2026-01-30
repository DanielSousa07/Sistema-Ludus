import { NavFooter } from "@/src/components/common/NavFooter"
import { Text, View } from "react-native"
export default function Favorites() {
    return (
        <View style={{flex: 1}}>
            <Text>Favorites</Text>
            <NavFooter/>
        </View>
    )
}