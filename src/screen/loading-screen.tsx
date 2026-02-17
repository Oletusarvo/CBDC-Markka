import { Spinner } from '../components/spinner';

export function LoadingScreen() {
  return (
    <div className='flex flex-col w-full flex-1 items-center justify-center p-4'>
      <div className='flex flex-col gap-4 items-center justify-center'>
        <Spinner variant='large' />
        <h2 className='text-xl text-primary font-semibold'>Ladataan</h2>
        <p className='text-sm text-slate-500 text-center'>
          Sivu latautuu. Käytämme ilmaista palvelinta, joten tässä voi mennä yli minuutti. Kiitos
          kärsivällisyydestäsi.
        </p>
      </div>
    </div>
  );
}
