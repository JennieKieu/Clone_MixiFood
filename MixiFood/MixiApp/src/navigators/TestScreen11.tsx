import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParamList } from "./AppStack";
import { View } from "react-native";
import Animated from "react-native-reanimated";

function testScreen11({
    route,
    navigation,
  }: NativeStackScreenProps<AppStackParamList, 'Details'>) {
    const {tag} = route.params;
  
    return (
      <View style={styles.detailContainer}>
        <Animated.View
          sharedTransitionTag={tag}
          style={[styles.detailsImage, {backgroundColor: gallery[tag].color}]}
        />
        <View style={styles.wrapper}>
          <Animated.Text
            entering={FadeIn.delay(150).duration(1000)}
            style={[styles.header, styles.font28]}>
            {gallery[tag].title}
          </Animated.Text>
          <Animated.Text
            entering={FadeIn.delay(300).duration(1000)}
            style={styles.text}>
            {gallery[tag].description}
          </Animated.Text>
          <Animated.View
            entering={FadeIn.delay(500).duration(1000)}
            style={styles.callToActionWrapper}>
            <Pressable
              style={styles.callToAction}
              onPress={() => navigation.goBack()}>
              <Text style={styles.callToActionText}>see for yourself</Text>
            </Pressable>
          </Animated.View>
        </View>
      </View>
    );
  }