import "@/styles/globals.css";
import { Onest } from "next/font/google";
import Layout from "@/components/Layout";
import Head from "next/head";
import { CategoriesProvider } from "@/contexts/CategoriesContext";
import { CategoryByIdProvider } from "@/contexts/CategoryByIdContext";
import { BannersProvider } from "@/contexts/BannersContext";
import { PromoProvider } from "@/contexts/PromosContext";
import { PromoByIdProvider } from "@/contexts/PromoByIdContext";
import { ActivitiesProvider } from "@/contexts/ActivitiesContext";
import { CartProvider } from "@/contexts/CartContext";
import { UploadImageProvider } from "@/contexts/UploadImageContext";

const onest = Onest({ subsets: ["latin"] });

export default function App({ Component, pageProps }) {
  const useLayout = Component.getLayout || ((page) => <Layout>{page}</Layout>);

  return (
    <UploadImageProvider>
      <CartProvider>
        <ActivitiesProvider>
          <PromoByIdProvider>
            <PromoProvider>
              <BannersProvider>
                <CategoriesProvider>
                  <CategoryByIdProvider>
                    <Head>
                      <title>TripNest | Final Project by Rama Davana - DiBimbing.ID</title>

                      <link rel="icon" href="/logo/tripnest-favicon.png" />
                    </Head>

                    <Layout>
                      <main className={onest.className}>
                        <Component {...pageProps} />
                      </main>
                    </Layout>
                  </CategoryByIdProvider>
                </CategoriesProvider>
              </BannersProvider>
            </PromoProvider>
          </PromoByIdProvider>
        </ActivitiesProvider>
      </CartProvider>
    </UploadImageProvider>
  );
}
