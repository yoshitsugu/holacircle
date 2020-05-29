import Toastify from 'toastify-js';

type HcMessageOption = {
  text: string;
  /** default: success */
  type?: 'success' | 'error';
};

/**
 * toastify-jsをラップしたメッセージ表示コンポーネント
 */
const HcMessage = (options: HcMessageOption) => {
  const toast = Toastify({
    text: options.text,
    duration: 3000,
    close: true,
    gravity: 'top',
    position: 'right',
    backgroundColor:
      options.type === 'error'
        ? 'linear-gradient(to right, #9e1313, #d91a1a)'
        : 'linear-gradient(to right, #199c24, #23d932)',
    stopOnFocus: false,
  });

  const show = (): void => {
    toast.showToast();
  };

  return {
    show,
  };
};

export default HcMessage;
