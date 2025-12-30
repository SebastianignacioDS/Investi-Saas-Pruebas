import { Check } from 'lucide-react';
import { Button } from './ui/button';

const plans = [
  {
    name: 'Starter',
    price: '29',
    description: 'Perfect for individuals and small teams',
    features: [
      'Up to 5 team members',
      '10 GB storage',
      'Basic analytics',
      'Email support',
      'API access',
    ],
    popular: false,
  },
  {
    name: 'Professional',
    price: '79',
    description: 'For growing teams and businesses',
    features: [
      'Up to 20 team members',
      '100 GB storage',
      'Advanced analytics',
      'Priority support',
      'API access',
      'Custom integrations',
      'Advanced security',
    ],
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '199',
    description: 'For large organizations',
    features: [
      'Unlimited team members',
      'Unlimited storage',
      'Enterprise analytics',
      '24/7 dedicated support',
      'API access',
      'Custom integrations',
      'Advanced security',
      'SSO & SAML',
      'Custom contracts',
    ],
    popular: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-purple-100 text-purple-600 rounded-full mb-4">
            Pricing
          </div>
          <h2 className="text-4xl font-bold mb-4">Choose your plan</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start free and scale as you grow. No hidden fees.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow p-8 ${
                plan.popular ? 'border-2 border-blue-500' : 'border border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <div className="mb-6">
                <h3 className="font-semibold mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-gray-600">/month</span>
                </div>
              </div>
              <Button className="w-full mb-6" variant={plan.popular ? 'default' : 'outline'}>
                Get Started
              </Button>
              <div className="space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
