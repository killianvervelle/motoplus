import Expandable from '@/components/Expandable'
import ImageFallback from '@/helpers/ImageFallback'
import { getListPage } from '@/lib/contentParser'
import { markdownify } from '@/lib/utils/textConverter'
import PageHeader from '@/partials/PageHeader'
import SeoMeta from '@/partials/SeoMeta'
import Testimonials from '@/partials/Testimonials'
import { AboutUsItem, RegularPage } from '@/types'
import Link from 'next/link'
import { FaBoxOpen, FaCheckCircle, FaTools } from 'react-icons/fa'

const About = () => {
  const data: RegularPage = getListPage('about/_index.md')

  const { frontmatter } = data
  const {
    title,
    about_us,
    faq_section_title,
    button,
    faq_section_subtitle,
    faqs,
    testimonials_section_enable,
    testimonials_section_title,
    testimonials,
  } = frontmatter

  return (
    <>
      <SeoMeta {...frontmatter} />

      <PageHeader title={title} />

      <section className='section'>
        <div className='container'>
          {about_us?.map((section: AboutUsItem, index: number) => (
            <div className={`lg:flex gap-8 mt-14 lg:mt-28`} key={section?.title}>
              {index % 2 === 0 ? (
                <>
                  <ImageFallback
                    className='rounded-md mx-auto'
                    src={section?.image}
                    width={536}
                    height={449}
                    alt={section?.title}
                  />
                  <div className='mt-10 lg:mt-0'>
                    <h2>{section?.title}</h2>
                    {section?.content
                      .split(/\n\n+/) // split on blank lines
                      .map((para, i) => (
                        <p
                          key={i}
                          className="mt-4 text-text-light dark:text-darkmode-text-light leading-7 text-justify"
                          dangerouslySetInnerHTML={markdownify(para)}
                        />
                      ))}
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h2>{section.title}</h2>
                    <p
                      className='mt-4 text-text-light dark:text-darkmode-text-light leading-7'
                      dangerouslySetInnerHTML={markdownify(section.content)}
                    />
                  </div>
                  <ImageFallback
                    className='rounded-md mx-auto mt-10 lg:mt-0'
                    src={section.image}
                    width={536}
                    height={449}
                    alt={section.title}
                  />
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      {testimonials_section_enable && <Testimonials title={testimonials_section_title!} testimonials={testimonials!} />}

      <section className='section'>
        <div className='container'>
          <div className='px-7 dark:bg-darkmode-light text-center rounded-md '>
            <h2>Reasons to shop with us</h2>

            <div className='bg-light dark:bg-darkmode-light row justify-center gap-6 py-20 mt-14'>
              <div className='col-6 md:col-5 lg:col-3'>
                <div className='flex justify-center'>
                  <FaTools size={48} />
                </div>
                <h3 className='md:h4 mt-6 mb-4'>Direct from Dismantling</h3>
                <p>All parts come from bikes we dismantle ourselves—no third-party sellers.</p>
              </div>

              <div className='col-6 md:col-6 lg:col-3'>
                <div className='flex justify-center'>
                  <FaBoxOpen size={48} />
                </div>
                <h3 className='md:h4 mt-6 mb-4'>Fast & secure shipping</h3>
                <p>Carefully packed, nationwide delivery.</p>
              </div>

              <div className='col-6 md:col-5 lg:col-3'>
                <div className='flex justify-center'>
                  <FaCheckCircle size={48} />
                </div>
                <h3 className='md:h4 mt-6 mb-4'>Quality Guaranteed</h3>
                <p>Inspected and described by specialists for condition and authenticity.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='section'>
        <div className='container'>
          <div className='bg-light px-7 lg:px-32 py-20 dark:bg-darkmode-light mb-14 xl:mb-28 rounded-b-md'>
            <div className='row'>
              <div className='md:col-5 mx-auto space-y-5 mb-10 md:mb-0'>
                <h1 dangerouslySetInnerHTML={markdownify(faq_section_title!)} />
                <p dangerouslySetInnerHTML={markdownify(faq_section_subtitle!)} className='md:text-lg text-justify pr-5' />

                {button?.enable && (
                  <Link className='btn btn-sm md:btn-lg btn-primary font-medium hover:bg-gray-700' href={button.link}>
                    {button.label}
                  </Link>
                )}
              </div>

              <div className='md:col-7 text-justify'>
                <Expandable faqs={faqs!} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default About
