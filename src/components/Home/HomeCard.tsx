import { StyleSheet, Text, View } from "react-native"
import GameCardVertical from "./GameCardVertical"
import GameCarousel from "./GameCarousel"

export function HomeCard() {
    return (
        <View style={styles.card}>

           <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Para Você</Text>
            <Text style={styles.seeAll}>Ver tudo</Text>
            </View> 

            <GameCarousel/>
            <Text style={styles.sectionTitle}>Mais Alugados</Text>

                 <GameCardVertical
        title="Catan - Jogo Base"
        location="Biblioteca"
        rating={4.2}
        image="https://acdn-us.mitiendanube.com/stores/140/298/products/02584_grow_catan_o_jogo1-49ae88dc24acba281415759146626390-1024-1024.webp"
      />

      <GameCardVertical
        title="Banco Imobiliário"
        location="NAPNE"
        rating={2.0}
        image="https://reinodostabuleiros.com.br/cdn/shop/files/BancoImobiiarioBrasil01.png?v=1727798832"
      />

      <GameCardVertical
        title="Quem foi?"
        location="Biblioteca"
        rating={4.2}
        image="https://papergames.com.br/site/wp-content/uploads/2023/09/mockup_lp_quemfoi_T2_frente.png"
      />

        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 19,
        marginTop: 27,
    },

    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,

    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#333",
        marginVertical: 10,
    },
    seeAll: {
        color: "#4CAF50",
        fontWeight: "600",
    }
})