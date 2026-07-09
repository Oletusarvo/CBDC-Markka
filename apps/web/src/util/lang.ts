type TLang = {
  fi: string;
  en: string;
};

export const lang: { [x: string]: TLang } = {
  balance: {
    en: 'Balance',
    fi: 'Tilin Saldo',
  },
  cancel: {
    en: 'Cancel',
    fi: 'Peruuta',
  },
  loginShort: {
    en: 'Login',
    fi: 'Kirjaudu',
  },
  loginLong: {
    en: 'Login',
    fi: 'Kirjaudu Sisään',
  },
  logout: {
    en: 'Logout',
    fi: 'Kirjaudu Ulos',
  },
  sender: {
    en: 'Sender',
    fi: 'Lähettäjä',
  },
  recipient: {
    en: 'Recipient',
    fi: 'Vastaanottaja',
  },
  transactionId: {
    en: 'Transaction ID',
    fi: 'Rahasiirron Tunnus',
  },
  transaction: {
    en: 'Transaction',
    fi: 'Rahasiirto',
  },
  idCopied: {
    en: 'ID Copied!',
    fi: 'ID Kopioitu!',
  },
  copySenderId: {
    en: 'Copy sender ID',
    fi: 'Kopioi lähettäjän ID',
  },
  copyRecipientId: {
    en: 'Copy recipient ID',
    fi: 'Kopioi vastaanottajan ID',
  },
  message: {
    en: 'Message',
    fi: 'Viesti',
  },
  amount: {
    en: 'Amount',
    fi: 'Määrä',
  },
  date: {
    en: 'Date',
    fi: 'Päivämäärä',
  },
  yes: { en: 'Yes', fi: 'Kyllä' },
};
