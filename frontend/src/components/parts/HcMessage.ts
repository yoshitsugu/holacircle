import Toastify from 'toastify-js';

type HcMessageOption = {
  text: string;
  type?: 'success' | 'error';
};

const HcMessage = (options: HcMessageOption) => {
  const toast = Toastify({
    text: options.text,
    duration: 3000,
    close: true,
    gravity: 'top',
    position: 'right',
    backgroundColor: options.type === 'error' ? '#c70000' : '#74d7ca',
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
