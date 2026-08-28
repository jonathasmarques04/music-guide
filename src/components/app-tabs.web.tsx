import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
  TabListProps,
} from 'expo-router/ui';
import { useState } from 'react';
import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';

import classes from './app-tabs.module.css';
import { ThemedText } from './themed-text';

import { Fonts, MinTouchTarget, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/**
 * Abaixo disso a barra vira uma faixa de largura total com as abas dividindo o
 * espaço em partes iguais — o comportamento que se espera de uma navegação
 * inferior no celular. Acima, ela é uma ilha centrada.
 */
const LARGURA_COMPACTA = 560;

/**
 * Teto da ilha no desktop. Menor que `MaxContentWidth` (800) de propósito: a
 * barra acompanha o conteúdo sem virar uma faixa vazia atravessando a tela.
 */
const LARGURA_MAXIMA = 560;

const TAMANHO_ICONE = 20;

type Aba = 'trilha' | 'flashcards';

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="home" href="/" asChild>
            <TabButton icone="trilha">Trilha</TabButton>
          </TabTrigger>
          <TabTrigger name="explore" href="/explore" asChild>
            <TabButton icone="flashcards">Flashcards</TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

export function TabButton({
  children,
  isFocused,
  icone,
  ...props
}: TabTriggerSlotProps & { icone: Aba }) {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const [sobre, setSobre] = useState(false);

  /** Na faixa estreita as abas dividem a largura em partes iguais. */
  const expandir = width < LARGURA_COMPACTA;
  const cor = isFocused ? theme.accent : sobre ? theme.text : theme.textSecondary;
  const Icone = icone === 'trilha' ? IconeTrilha : IconeFlashcards;

  return (
    <Pressable
      {...props}
      accessibilityRole="tab"
      // A aba ativa se anuncia pelo estado, não pela cor. O `aria-selected` é
      // o que de fato chega ao DOM: o react-native-web 0.21 não converte mais
      // `accessibilityState.selected` sozinho (verificado no navegador).
      accessibilityState={{ selected: isFocused }}
      aria-selected={isFocused}
      onHoverIn={() => setSobre(true)}
      onHoverOut={() => setSobre(false)}
      style={({ pressed }) => [
        styles.aba,
        expandir && styles.abaExpandida,
        // A borda existe sempre (transparente quando inativa) para o texto não
        // pular 1px ao trocar de aba.
        { borderColor: 'transparent' },
        !isFocused && sobre && { backgroundColor: theme.backgroundSelected },
        isFocused && { backgroundColor: theme.accentSurface, borderColor: theme.accent },
        pressed && styles.pressionada,
      ]}>
      {/*
        O ícone preenche quando a aba está ativa. É uma diferença de FORMA, não
        só de cor — junto com o negrito, quem não distingue o roxo ainda sabe
        onde está.
      */}
      <Icone ativo={!!isFocused} cor={cor} />

      <ThemedText type={isFocused ? 'smallBold' : 'small'} style={{ color: cor }}>
        {children}
      </ThemedText>
    </Pressable>
  );
}

export function CustomTabList({ children, ...props }: TabListProps) {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const compacta = width < LARGURA_COMPACTA;

  return (
    // `box-none` deixa o clique passar nas laterais: a barra flutua sobre o
    // conteúdo e não pode capturar toda a faixa de baixo da tela.
    <View {...props} pointerEvents="box-none" style={styles.doca}>
      <View
        style={[
          styles.barra,
          { borderColor: theme.border },
          compacta ? styles.barraCompacta : styles.barraAmpla,
        ]}>
        {/*
          O desfoque vai inline, e não no .module.css, porque o transformador
          de CSS do Metro (lightningcss) descarta `backdrop-filter` na
          compilação — verificado lendo a regra já servida no navegador, que
          chegava sem a propriedade. Estilo inline não passa por ele.
        */}
        <div
          className={classes.glass}
          style={{
            backdropFilter: 'blur(24px) saturate(150%)',
            WebkitBackdropFilter: 'blur(24px) saturate(150%)',
          }}
        />

        {/*
          No estreito a marca sai de cena por inteiro: num espaço em que cada
          pixel é do alvo de toque, uma assinatura decorativa custa 56px e não
          ajuda ninguém a navegar. O app já se identifica no cabeçalho da tela.
        */}
        {!compacta && (
          <View style={styles.marca}>
            <View style={[styles.marcaSimbolo, { backgroundColor: theme.accentSurface }]}>
              <ThemedText themeColor="accent" style={styles.marcaNota}>
                ♪
              </ThemedText>
            </View>

            <ThemedText type="smallBold" style={styles.marcaTexto}>
              musica
            </ThemedText>
          </View>
        )}

        {/* `tablist` é o que dá sentido aos `tab` filhos para o leitor de tela. */}
        <View
          accessibilityRole="tablist"
          style={[styles.abas, compacta ? styles.abasCompactas : styles.abasAmplas]}>
          {children}
        </View>
      </View>
    </View>
  );
}

// --- Ícones -----------------------------------------------------------------
// Desenhados aqui, em SVG, porque os PNGs de `assets/images/tabIcons` são os do
// template do Expo (uma casinha e uma bússola) e não dizem nada sobre trilha de
// teoria musical nem sobre baralho de revisão. SVG também escala sem borrar.

type IconeProps = { ativo: boolean; cor: string };

/** Três cabeças de nota subindo: a trilha avança e a altura sobe. */
function IconeTrilha({ ativo, cor }: IconeProps) {
  return (
    <svg
      width={TAMANHO_ICONE}
      height={TAMANHO_ICONE}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false">
      <path
        d="M5 17.5 L12 12 L19 6.5"
        stroke={cor}
        strokeWidth={1.5}
        strokeLinecap="round"
        opacity={0.6}
      />
      <circle cx="5" cy="17.5" r="2.6" stroke={cor} strokeWidth={1.6} fill={ativo ? cor : 'none'} />
      <circle cx="12" cy="12" r="2.6" stroke={cor} strokeWidth={1.6} fill={ativo ? cor : 'none'} />
      <circle cx="19" cy="6.5" r="2.6" stroke={cor} strokeWidth={1.6} fill={ativo ? cor : 'none'} />
    </svg>
  );
}

/** Baralho: a carta da frente vira sólida quando a aba está ativa. */
function IconeFlashcards({ ativo, cor }: IconeProps) {
  return (
    <svg
      width={TAMANHO_ICONE}
      height={TAMANHO_ICONE}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false">
      <rect
        x="7.5"
        y="3.5"
        width="13"
        height="10"
        rx="2.4"
        stroke={cor}
        strokeWidth={1.6}
        opacity={0.55}
      />
      <rect
        x="3.5"
        y="9.5"
        width="13"
        height="11"
        rx="2.4"
        stroke={cor}
        strokeWidth={1.6}
        fill={ativo ? cor : 'none'}
      />
    </svg>
  );
}

const styles = StyleSheet.create({
  doca: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: Spacing.four,
    zIndex: 10,
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
  },
  barra: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
    paddingLeft: Spacing.three,
    paddingRight: Spacing.two,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.five,
    borderWidth: 1,
    overflow: 'hidden',
    width: '100%',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
  },
  /** Ilha centrada: acompanha o conteúdo sem atravessar a tela inteira. */
  barraAmpla: {
    maxWidth: LARGURA_MAXIMA,
  },
  /** Faixa de largura total, como uma navegação inferior de celular. */
  barraCompacta: {
    paddingLeft: Spacing.two,
  },
  marca: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    flexShrink: 0,
  },
  marcaSimbolo: {
    width: 32,
    height: 32,
    flexShrink: 0,
    borderRadius: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
  },
  marcaNota: {
    fontSize: 18,
    lineHeight: 24,
  },
  /** Fonte arredondada e espaçamento aberto: a marca não compete com as abas. */
  marcaTexto: {
    fontFamily: Fonts.rounded,
    letterSpacing: 0.4,
  },
  abas: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  abasAmplas: {
    gap: Spacing.one,
  },
  abasCompactas: {
    flex: 1,
    gap: Spacing.half,
    marginLeft: Spacing.two,
  },
  aba: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    minHeight: MinTouchTarget,
    minWidth: MinTouchTarget,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.four,
    borderWidth: 1,
  },
  abaExpandida: {
    flex: 1,
    paddingHorizontal: Spacing.two,
  },
  pressionada: {
    opacity: 0.7,
  },
});
