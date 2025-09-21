import React, { useEffect, useState } from 'react';
import { Main, Column, Row, Title, Label, Button, colors, Icon, Tabs, Pressable, ScrollHorizontal } from "@/ui/index";
import { ImageBackground } from 'expo-image';
import { usePostHog } from 'posthog-react-native';

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
}

const plans: Plan[] = [
  {
    id: 'free',
    name: 'Gratuito',
    price: 'R$ 0,00',
    period: '/mês',
    description: 'Ideal para testar a plataforma e pequenos empreendedores',
    features: [
      'Até 25 produtos',
      'Até 25 fornecedores',
      'Até 30 categorias',
      'Relatórios básicos',
    ],
  },
  {
    id: 'starter',
    name: 'Premium',
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
  }
];

export default function PlansScreen() {
  const theme = colors();
  const [selectedPlan, setSelectedPlan] = useState<string>('free');
  const [tab, setTab] = useState<string>('Mensal');
  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    posthog.capture("Plano selecionado", { plan: planId })
  };

  const posthog = usePostHog()
  useEffect(() => {
    posthog.capture("Plano selecionado", { plan: selectedPlan })
  }, [selectedPlan])


  const PlanCard = ({ plan }: { plan: Plan }) => {
    const theme = colors();
    return (
      <Column
        pv={16}
        ph={20}
        style={{
          backgroundColor: "#fff",
          borderRadius: 12,
          borderWidth: 2,
          borderColor: selectedPlan === plan.id ? theme.color.primary : theme.color.ghost,
        }}
      >
        {plan.popular && (
          <Row pv={4} ph={8} style={{ position: "absolute", top: 0, right: 0, backgroundColor: theme.color.primary, borderBottomLeftRadius: 6 }}>
            <Label size={12} color='#fff'>
              MAIS POPULAR
            </Label>
          </Row>
        )}

        <Column gv={16}>
          <Title size={24} >
            {plan.name}
          </Title>


          <ImageBackground source={require('@/imgs/plan_bg_img.png')} imageStyle={{ borderRadius: 12 }} style={{ flexGrow: 1, }}>
            <Row justify='space-between' pv={12} gh={12} ph={16} align='center'>
              <Title size={32} color='#fff' fontFamily='Font_Medium'>
                {plan.price}
              </Title>
              <Label size={14} style={{ width: 160, }} color='#fff'>
                {plan.description}
              </Label>
            </Row>
          </ImageBackground>


          <Column gv={12}>
            {plan.features.map((feature, index) => (
              <Row key={index} align="center" gh={8}>
                <Row justify='center' align='center' style={{ backgroundColor: theme.color.primary, borderRadius: 100, width: 24, height: 24, }}>
                  <Icon name="Check" color="#fff" size={16} />
                </Row>
                <Label size={14} style={{ flex: 1 }}>
                  {feature}
                </Label>
              </Row>
            ))}
          </Column>
          <Button label={plan.id === selectedPlan ? "Plano selecionado" : "Assinar"} onPress={() => handleSelectPlan(plan.id)} style={{ width: "100%" }} variant={plan.id === selectedPlan ? "primary" : "outline"} />
        </Column>
      </Column>
    )
  }

  return (
    <Main>
      <Column>
        <Tabs types={["Mensal", "Anual"]} value={tab} setValue={setTab} />
      </Column>
      <Column gv={6} mh={26} mv={24}>
        <Title >
          Escolha seu Plano
        </Title>
        <Label >
          Selecione o plano ideal para o seu negócio
        </Label>
      </Column>
      <ScrollHorizontal horizontal={true} pagingEnabled={true}>
        <Row align='flex-start' gh={16} ph={26} mb={50}>

          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </Row>
      </ScrollHorizontal>

    </Main>
  );
}
