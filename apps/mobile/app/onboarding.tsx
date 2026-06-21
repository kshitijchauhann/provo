import React, { useRef, useState } from 'react';
import { FlatList, ViewToken, useWindowDimensions } from 'react-native';
import { YStack, XStack, Button, H1, Paragraph, Text, Theme } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useOnboarding } from '@/components/onboarding-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.prototype.props.name | string;
  iconColor: string;
}

const slides: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Welcome to Provo',
    description: 'A premium, modern Expo application built with Tamagui, designed for exceptional performance and stunning visuals.',
    icon: 'rocket',
    iconColor: '#00D2FF',
  },
  {
    id: '2',
    title: 'Unified Design System',
    description: 'Seamlessly transition between light and dark modes with Tamagui components. Craft responsive, highly polished native UIs.',
    icon: 'color-palette',
    iconColor: '#00F2FE',
  },
  {
    id: '3',
    title: 'Ready, Set, Launch!',
    description: 'Your development workspace is pre-configured and optimized. Step inside and let your creativity take flight.',
    icon: 'sparkles',
    iconColor: '#B163FF',
  },
];

export default function OnboardingScreen() {
  const { completeOnboarding } = useOnboarding();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  });

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].index !== null) {
      setActiveIndex(viewableItems[0].index);
    }
  });

  const handleNext = () => {
    if (activeIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: activeIndex + 1,
        animated: true,
      });
    } else {
      completeOnboarding();
    }
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  return (
    <Theme name={isDark ? 'dark' : 'light'}>
      <YStack
        flex={1}
        backgroundColor={isDark ? '#151718' : '#FFFFFF'}
        style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      >
        {/* Skip button header */}
        <XStack justifyContent="flex-end" px="$4" py="$2">
          {activeIndex < slides.length - 1 ? (
            <Button
              size="$3"
              chromeless
              onPress={handleSkip}
            >
              <Text color={isDark ? '#9BA1A6' : '#687076'} fontWeight="600">
                Skip
              </Text>
            </Button>
          ) : (
            <YStack height={40} />
          )}
        </XStack>

        {/* Carousel FlatList */}
        <FlatList
          ref={flatListRef}
          data={slides}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged.current}
          viewabilityConfig={viewabilityConfig.current}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <YStack
              width={width}
              flex={1}
              justifyContent="center"
              alignItems="center"
              px="$6"
              gap="$5"
            >
              {/* Icon Container with subtle background glassmorphic effect */}
              <YStack
                backgroundColor={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'}
                p="$6"
                borderRadius={32}
                borderWidth={1}
                borderColor={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}
                alignItems="center"
                justifyContent="center"
                shadowColor="#000"
                shadowOffset={{ width: 0, height: 8 }}
                shadowOpacity={isDark ? 0.3 : 0.08}
                shadowRadius={16}
              >
                <Ionicons
                  name={item.icon as any}
                  size={84}
                  color={item.iconColor}
                />
              </YStack>

              <YStack gap="$2" alignItems="center" px="$2">
                <H1
                  textAlign="center"
                  fontSize={28}
                  fontWeight="bold"
                  color={isDark ? '#ECEDEE' : '#11181C'}
                >
                  {item.title}
                </H1>
                <Paragraph
                  textAlign="center"
                  fontSize={16}
                  lineHeight={24}
                  color={isDark ? '#9BA1A6' : '#687076'}
                  maxWidth={320}
                >
                  {item.description}
                </Paragraph>
              </YStack>
            </YStack>
          )}
        />

        {/* Footer actions & slide indicators */}
        <YStack px="$6" py="$4" gap="$5">
          {/* Active indicators / Dots */}
          <XStack justifyContent="center" gap="$2" alignItems="center">
            {slides.map((_, index) => {
              const isActive = index === activeIndex;
              return (
                <YStack
                  key={index}
                  height={8}
                  width={isActive ? 24 : 8}
                  borderRadius={4}
                  backgroundColor={
                    isActive
                      ? slides[activeIndex].iconColor
                      : isDark
                      ? 'rgba(255,255,255,0.2)'
                      : 'rgba(0,0,0,0.15)'
                  }
                />
              );
            })}
          </XStack>

          {/* Core button (Next / Get Started) */}
          <Button
            size="$5"
            backgroundColor={slides[activeIndex].iconColor}
            onPress={handleNext}
            borderRadius={16}
            fontWeight="bold"
            pressStyle={{ opacity: 0.8 }}
            color="#FFFFFF"
            shadowColor="#000"
            shadowOffset={{ width: 0, height: 4 }}
            shadowOpacity={0.2}
            shadowRadius={8}
          >
            {activeIndex === slides.length - 1 ? 'Get Started' : 'Next'}
          </Button>
        </YStack>
      </YStack>
    </Theme>
  );
}
