import { AmountDisplay } from '@/components/QRPayments/amount-display';
import { BankActionsDrawer, type BankItem } from '@/components/QRPayments/bank-actions-drawer';
import { PaymentHeader } from '@/components/QRPayments/header';
import { MessageInput } from '@/components/QRPayments/message-input';
import { NumberPad } from '@/components/QRPayments/number-pad';
import { ProceedButton } from '@/components/QRPayments/proceed-button';
import { ProfileSection } from '@/components/QRPayments/profile-section';
import { InstacardColors } from '@/constants/colors';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PaymentAmounts() {
  const insets = useSafeAreaInsets();
  const [amount, setAmount] = useState('0');
  const [message, setMessage] = useState('');
  const [bankDrawerVisible, setBankDrawerVisible] = useState(false);
  const [selectedBankId, setSelectedBankId] = useState<string | null>(null);

  // Mock data - replace with actual data from navigation params
  const recipientData = {
    name: 'Nirdesh Malik',
    phone: '9876543210',
    upiId: 'nirdeshmalik@okaxis',
  };

  const banks: BankItem[] = [
    {
      id: 'debit1',
      name: 'Axis Bank Debit',
      subtitle: 'Visa •••• 4521',
      balance: 'N 12,450.10',
      cardType: 'debit',
    },
    {
      id: 'debit2',
      name: 'HDFC Bank Debit',
      subtitle: 'RuPay •••• 9912',
      balance: 'N 8,200.50',
      cardType: 'debit',
    },
    {
      id: 'credit1',
      name: 'HDFC Regalia',
      subtitle: 'Mastercard •••• 8834',
      balance: 'N 50,000.00',
      cardType: 'credit',
    },
    {
      id: 'credit2',
      name: 'SBI SimplyClick',
      subtitle: 'Visa •••• 1129',
      balance: 'N 35,600.75',
      cardType: 'credit',
    },
    {
      id: 'prepaid1',
      name: 'Instacard Prepaid',
      subtitle: 'Virtual •••• 7788',
      balance: 'N 9,500.00',
      cardType: 'prepaid',
    },
    {
      id: 'gift1',
      name: 'Instacard Gift',
      subtitle: 'Gift Card •••• 1122',
      balance: 'N 5,000.00',
      cardType: 'gift',
    },
  ];

  const initials = recipientData.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleNumberPress = (num: string) => {
    if (num === '.' && amount.includes('.')) return;
    
    let newAmount: string;
    if (amount === '0' && num !== '.') {
      newAmount = num;
    } else {
      newAmount = amount + num;
    }
    
    // Max limit is 1 lakh (100000)
    const numericValue = parseFloat(newAmount.replace(/,/g, ''));
    if (numericValue > 1000000) return;
    
    setAmount(newAmount);
  };

  const handleBackspace = () => {
    if (amount.length > 1) {
      setAmount(amount.slice(0, -1));
    } else {
      setAmount('0');
    }
  };

  const handleProceed = () => {
    setBankDrawerVisible(true);
  };

  return (
    <View  style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      <PaymentHeader />

      <ProfileSection
        name={recipientData.name}
        phone={recipientData.phone}
        upiId={recipientData.upiId}
        initials={initials}
      />

      <AmountDisplay amount={amount} />

      <MessageInput value={message} onChangeText={setMessage} />

      <View style={styles.proceedSection}>
        <ProceedButton amount={amount} onPress={handleProceed} />
      </View>

      <NumberPad onNumberPress={handleNumberPress} onBackspace={handleBackspace} />

      <BankActionsDrawer
        visible={bankDrawerVisible}
        amount={amount}
        banks={banks}
        selectedBankId={selectedBankId}
        onSelectBank={setSelectedBankId}
        onClose={() => setBankDrawerVisible(false)}
        onAddNew={() => {
          setBankDrawerVisible(false);
          console.log('Add new bank/card');
        }}
        onConfirm={() => {
          setBankDrawerVisible(false);
          router.push({
            pathname: '/QRPayments/pin-auth',
            params: {
              amount,
              message,
              bankId: selectedBankId ?? '',
              recipientName: recipientData.name,
              upiId: recipientData.upiId,
            },
          });
          console.log('Confirm bank + proceed', { amount, message, bankId: selectedBankId });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: InstacardColors.white,
   
  },
  proceedSection: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
});
