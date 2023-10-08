import { useState, useEffect } from 'react';
import { copy, linkIcon, loader, tick } from '../assets';
import { useLazyGetSummaryQuery } from '../services/article';

interface Article {
  summary: string;
  url: string;
};

function Demo() {
  const [article, setArticle] = useState<Article>({
    url: '',
    summary: ''
  });
  const [allArticles, setAllArticles] = useState<Array<Article>>([]);
  const [copied, setCopied] = useState("");

  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();

  useEffect(() => {
    const articleFromLocalStorage = localStorage.getItem('articles');

    if(articleFromLocalStorage) {
      setAllArticles(JSON.parse(articleFromLocalStorage));
    }
  }, []);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const { data } = await getSummary({ articleUrl: article.url });

    if(data?.summary) {
      const newArticle = { ...article, summary: data.summary };
      const updatedArticles = [newArticle, ...allArticles];

      setArticle(newArticle);
      setAllArticles(updatedArticles);

      localStorage.setItem('articles', JSON.stringify(updatedArticles));
    }
  };

  const handleCopy = (copyUrl:string) => {
    setCopied(copyUrl);
    navigator.clipboard.writeText(copyUrl);

    setTimeout(() => setCopied(""), 3000);
  }

  return (
    <section className='mt-16 w-full max-w-xl'>
      <div className='flex flex-col w-full gap-2'>
        <form className='relative flex justify-center items-center' onSubmit={handleSubmit}>
          <img src={linkIcon} alt='link-icon' className='absolute left-0 my-2 ml-3 w-5' />
          <input type='url' placeholder='Enter a url' value={article.url} onChange={(e) => setArticle({...article, url: e.target.value })} required className='url_input peer' />
          <button type='submit' className='submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700'>&#x25C0;</button>
        </form>
        <div className='flex flex-col gap-1 max-h-60 overflow-y-auto'>
          {allArticles.map((item, index) => (
            <div key={`link-${index}`} onClick={() => setArticle(item)} className='link_card'>
              <div className='copy_btn' onClick={() => handleCopy(item.url)}>
                <img 
                  src={copied === item.url ? tick : copy} 
                  alt="copy_icon" 
                  className='w-[40%] h-[40%] object-contain' 
                />
              </div>
              <p className='flex-1 font-satoshi text-blue-700 font-medium text-sm truncate'>{item.url}</p>
            </div>
          ))}
        </div>
      </div>
      <div className='my-10 max-w-full flex justify-center items-center'>
        {isFetching ? (
          <img src={loader} alt='loader' className='w-20 h-20 object-contain' />
        ): error ? (
          <p className='font-inter font-bold text-black text-center'>
            Error happened sorry....
          </p>
        ): (
          article.summary && (
            <div className='flex flex-col gap-3'>
              <h2 className='font-satoshi font-bold text-gray-600 text-xl'>Article <span className='blue_gradient'>Summary</span></h2>
              <div className='summary_box'><p className='font-inter text-sm text-gray-700'>{article.summary}</p></div>
            </div>
          )
        )}
      </div>
    </section>
  )
}

export default Demo