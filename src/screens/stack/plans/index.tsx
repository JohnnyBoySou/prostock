import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Main, Column, Row, ScrollVertical, Title, HeadTitle, Label, SubLabel, Button, colors } from "@/ui/index";

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  color: string;
}

const plans: Plan[] = [
    {
      id: 'free',
      name: 'Free',
      price: 'R$ 0',
      period: '/mês',
      description: 'Ideal para testar a plataforma e pequenos empreendedores',
      features: [
        'Até 50 produtos',
        '1 usuário',
        'Relatórios básicos',
        'Backup diário'
      ],
      color: colors.color.green
    },
    {
      id: 'starter',
      name: 'Starter',
      price: 'R$ 9,99',
      period: '/mês',
      description: 'Perfeito para pequenos negócios que estão crescendo',
      features: [
        'Até 200 produtos',
        'Até 3 usuários',
        'Relatórios avançados',
        'Suporte por email',
        'Exportação CSV',
        'Notificações de estoque'
      ],
      popular: true,
      color: colors.color.blue
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 'R$ 29,99',
      period: '/mês',
      description: 'Solução completa para empresas em crescimento',
      features: [
        'Produtos ilimitados',
        'Até 10 usuários',
        'Relatórios completos e dashboards',
        'Suporte prioritário',
        'Backup em nuvem',
        'Integrações futuras (ERP / e-commerce)',
        'Análise de vendas avançada',
        'Notificações push'
      ],
      color: colors.color.primary
    }
  ];
  
export default function PlansScreen() {
  const [selectedPlan, setSelectedPlan] = useState<string>('free');

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleSubscribe = () => {
    console.log('Plano selecionado:', selectedPlan);
  };

  const PlanCard = ({ plan }: { plan: Plan }) => (
    <TouchableOpacity
      style={[
        styles.planCard,
        selectedPlan === plan.id && styles.selectedCard,
        plan.popular && styles.popularCard
      ]}
      onPress={() => handleSelectPlan(plan.id)}
      activeOpacity={0.8}
    >
      {plan.popular && (
        <View style={styles.popularBadge}>
          <Label color={colors.color.textGhost} size={12} fontFamily="Font_Bold">
            MAIS POPULAR
          </Label>
        </View>
      )}
      
      <Column align="center" gv={16}>
        <Title size={24} color={plan.color} fontFamily="Font_Bold">
          {plan.name}
        </Title>
        
        <Column align="center">
          <Row align="center" justify="center">
            <HeadTitle size={36} color={plan.color} fontFamily="Font_Bold">
              {plan.price}
            </HeadTitle>
            <SubLabel color={colors.color.textPrimary} size={16} ml={4}>
              {plan.period}
            </SubLabel>
          </Row>
        </Column>

        <SubLabel align="center" color={colors.color.textPrimary} size={14}>
          {plan.description}
        </SubLabel>

        <Column gv={12} style={styles.featuresContainer}>
          {plan.features.map((feature, index) => (
            <Row key={index} align="center" gv={8}>
              <View style={[styles.checkIcon, { backgroundColor: plan.color }]} />
              <Label color={colors.color.textPrimary} size={14} style={{ flex: 1 }}>
                {feature}
              </Label>
            </Row>
          ))}
        </Column>
      </Column>
    </TouchableOpacity>
  );

  return (
    <Main>
      <ScrollVertical>
        <Column mh={20} gv={24}>
          <Column align="center" gv={12}>
            <HeadTitle align="center" color={colors.color.textPrimary} size={32}>
              Escolha seu Plano
            </HeadTitle>
            <SubLabel align="center" color={colors.color.textPrimary} size={16}>
              Selecione o plano ideal para o seu negócio
            </SubLabel>
          </Column>

          <Column gv={20}>
            {plans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </Column>

          <Column gv={16} mt={20}>
            <Button
              label={`Assinar ${plans.find(p => p.id === selectedPlan)?.name}`}
              onPress={handleSubscribe}
              style={styles.subscribeButton}
            />
            <Button
              label="Voltar"
              variant="outline"
              onPress={() => {/* Implementar navegação de volta */}}
            />
          </Column>
        </Column>
      </ScrollVertical>
    </Main>
  );
}

const styles = StyleSheet.create({
  planCard: {
    backgroundColor: colors.color.secundary,
    borderRadius: 16,
    padding: 24,
    borderWidth: 2,
    borderColor: colors.color.muted,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedCard: {
    borderColor: colors.color.primary,
    shadowOpacity: 0.2,
    elevation: 6,
  },
  popularCard: {
    borderColor: colors.color.primary,
    shadowOpacity: 0.25,
    elevation: 8,
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    left: 20,
    right: 20,
    backgroundColor: colors.color.primary,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 16,
    alignItems: 'center',
    zIndex: 1,
  },
  featuresContainer: {
    width: '100%',
    marginTop: 8,
  },
  checkIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subscribeButton: {
    backgroundColor: colors.color.primary,
    borderRadius: 12,
    height: 56,
  },
});
