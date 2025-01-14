'use client';
import AppLayout from '@/components/mainLayouts/AppLayout';
import SearchBar from '@/components/SearchBar';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function Home() {
  return (
    <AppLayout>
      <div className='container-fluid d-flex justify-content-center align-items-center h-100 py-3' style={{ flexDirection: 'column' }}>
        <div className='main-content-class w-100'>
          <div className="row justify-content-center">
            <div className="col-md-10 col-sm-12">
              <h4 className='hero-heading text-center'>
                Nulla sit amet venenatis praesen
              </h4>
              <p className='hero-paragraph text-center'>
                Vestibulum elementum enim consequat est cursus pulvinar. Maecenas posuere sapien at faucibus posuere. Morbi dictum eget ex sed hendrerit. Pellentesque a aliquam erat, id aliquet nisi. Integer ut mauris non erat molestie egestas eget vitae turpis.
              </p>
            </div>
            <div className="col-md-6 col-sm-12">
              <SearchBar parent={"homePage"} />
            </div>
            <p className='hero-paragraph text-center mt-2 mb-4'>Vestibulum elementum enim consequat est cursus pulvinar</p>
          </div>
          <div className="row">
            <div className="col-lg-2 col-md-3 col-sm-12">
              <Link href={"/stocks"} className='link-decoration-none'>
                <div className="card hero-card">
                  <div className="columnFlex" style={{ padding: "1.25rem" }}>
                    <Image src="/assets/svg/Stocks.svg" alt="Search" width={80} height={80} priority />
                    <p className="heroCardTitle mb-0 mt-3">Stocks</p>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-lg-2 col-md-3 col-sm-12">
              <Link href={"/crypto"} className='link-decoration-none'>
                <div className="card hero-card">
                  <div className="columnFlex" style={{ padding: "1.25rem" }}>
                    <Image src="/assets/svg/Crypto.svg" alt="Search" width={80} height={80} priority />
                    <p className="heroCardTitle mb-0 mt-3">Crypto</p>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-lg-2 col-md-3 col-sm-12">
              <Link href={"/news"} className='link-decoration-none'>
                <div className="card hero-card">
                  <div className="columnFlex" style={{ padding: "1.25rem" }}>
                    <Image src="/assets/svg/News.svg" alt="Search" width={80} height={80} priority />
                    <p className="heroCardTitle mb-0 mt-3">NewsLetter</p>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-lg-2 col-md-3 col-sm-12">
              <Link href={"/"} className='link-decoration-none'>
                <div className="card hero-card">
                  <div className="columnFlex" style={{ padding: "1.25rem" }}>
                    <Image src="/assets/svg/MarketMovers.svg" alt="Search" width={80} height={80} priority />
                    <p className="heroCardTitle mb-0 mt-3">Market Movers</p>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-lg-2 col-md-3 col-sm-12">
              <Link href={"/"} className='link-decoration-none'>
                <div className="card hero-card">
                  <div className="columnFlex" style={{ padding: "1.25rem" }}>
                    <Image src="/assets/svg/DiscussionBoard.svg" alt="Search" width={80} height={80} priority />
                    <p className="heroCardTitle mb-0 mt-3">Discussion Board</p>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-lg-2 col-md-3 col-sm-12">
              <Link href={"/watchlist"} className='link-decoration-none'>
                <div className="card hero-card">
                  <div className="columnFlex" style={{ padding: "1.25rem" }}>
                    <Image src="/assets/svg/Watchlist.svg" alt="Search" width={80} height={80} priority />
                    <p className="heroCardTitle mb-0 mt-3">Watchlist</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
