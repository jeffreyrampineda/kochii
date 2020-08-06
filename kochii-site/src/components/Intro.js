import React from 'react';

const Intro = props => {

  return (
    <React.Fragment>
      <header>
        <div id="intro" class="view" title="Kitchen Table with Ingredients">
          <div class="mask rgba-black-strong">
            <div class="container-fluid d-flex align-items-center justify-content-center h-100">
              <div class="row d-flex justify-content-center text-center">
                <div class="col-md-10">
                  <h1 class="display-4 font-weight-bold white-text pt-5 mb-2">Organize your kitchen</h1>
                  <hr class="hr-light" />
                  <h4 class="white-text my-4">Kochii assists and encourages individuals for a manageable meal
                                preparation lifestyle</h4>
                  <a class="btn blue-gradient" href="/register" style={{ borderRadius: '10em' }}>Sign up</a>
                  <a class="btn btn-outline-white" href="#features" style={{ borderRadius: '10em' }}>Learn
                                more</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main class="mt-5">
        <div class="container mb-5">
          <section id="features" class="text-center">
            <h2 class="mb-5 font-weight-bold">Features</h2>
            <div class="row d-flex justify-content-center mb-4">
              <div class="col-md-8">
                <p class="grey-text">Simplify your day to day life by letting Kochii assist you in managing your
                pantry cabinets and cooking ingredients. The easy-to-use user interface allows even the most
                        busiest individuals organize a part of their lifestyle entirely online.</p>

              </div>
            </div>
            <div class="row">
              <div class="col-md-4 mb-5">
                <i class="fas fa-clipboard-list fa-4x"></i>
                <h4 class="my-4 font-weight-bold">Record</h4>
                <p class="grey-text">Keep track of what you buy and use at a week-by-week basis and organize them
                        using Kochii's simplified user interface.</p>
              </div>
              <div class="col-md-4 mb-1">
                <i class="fas fa-bell fa-4x"></i>
                <h4 class="my-4 font-weight-bold">Notify</h4>
                <p class="grey-text">Receive real-time up to date notifications regarding the status of your
                        inventory with a quick glance.</p>
              </div>
              <div class="col-md-4 mb-1">
                <i class="fas fa-chart-bar fa-4x"></i>
                <h4 class="my-4 font-weight-bold">Analyze</h4>
                <p class="grey-text">Examine a summary of your inventory's current and weekly state, and gain
                        insights on your unforeseen behaviours.</p>
              </div>
            </div>
          </section>
          <hr class="my-5" />
          <section id="results" class="text-center">
            <div class="row">
              <div class="col-lg-4 col-md-12 mb-4">
                <div class="view overlay z-depth-1-half">
                  <img alt="Recipe website opened on a Mac laptop screen"
                    src={"/annie-spratt-f4gQ-dJ0yo8-unsplash.jpg"} class="img-fluid" loading="lazy" />
                  <a href="#!">
                    <div class="mask rgba-white-slight"></div>
                  </a>
                </div>
                <h4 class="my-4 font-weight-bold">Know what you have</h4>
                <p class="grey-text">Kochii allows you easily find recipes online and will automatically inform you
                of the ingredients you currently have and do not have.
                    </p>
              </div>
              <div class="col-lg-4 col-md-6 mb-4">
                <div class="view overlay z-depth-1-half">
                  <img alt="Bicycle rider's Perspective with Bags of Groceries"
                    src={"/boxed-water-is-better-6WrKKQcEnXk-unsplash.jpg"} class="img-fluid"
                    loading="lazy" />
                  <a href="#!">
                    <div class="mask rgba-white-slight"></div>
                  </a>
                </div>
                <h4 class="my-4 font-weight-bold">Buy what you need</h4>
                <p class="grey-text">The built-in grocery list feature will alert you when adding existing
                        ingredients to buy for your upcoming grocery shopping.</p>
              </div>
              <div class="col-lg-4 col-md-6 mb-4">
                <div class="view overlay z-depth-1-half">
                  <img alt="Tabletop Plant in Clear Vase with Coins instead of Soil"
                    src={"/micheile-henderson-SoT4-mZhyhE-unsplash.jpg"} class="img-fluid" loading="lazy" />
                  <a href="#!">
                    <div class="mask rgba-white-slight"></div>
                  </a>
                </div>
                <h4 class="my-4 font-weight-bold">Waste less, save money</h4>
                <p class="grey-text">You will be notified when a product's expiration date is near.
                        Use them before they go bad. Do not let the money you've spent go to waste.</p>

              </div>
            </div>
          </section>
          <hr class="my-5" />
          <section id="blog">
            <h2 class="mb-5 font-weight-bold text-center">Share your experience</h2>
            <div class="row">
              <div class="col-md-6 mb-4">
                <div id="carousel-example-1z" class="carousel slide carousel-fade" data-ride="carousel">
                  <ol class="carousel-indicators">
                    <li data-target="#carousel-example-1z" data-slide-to="0" class="active"></li>
                    <li data-target="#carousel-example-1z" data-slide-to="1"></li>
                  </ol>
                  <div class="carousel-inner" role="listbox">
                    <div class="carousel-item active">
                      <img alt="Young lady in a Fitness Outfit Preparing a Drink" class="d-block w-100"
                        src={"/lyfe-fuel-4wtxPhvQZds-unsplash.jpg"} loading="lazy" />
                    </div>
                    <div class="carousel-item">
                      <img alt="Close up picture of a Fan of Hundred Dollar Bills" class="d-block w-100"
                        src={"/viacheslav-bublyk-6WXbPWhT8c8-unsplash.jpg"} loading="lazy" />
                    </div>
                  </div>
                  <a class="carousel-control-prev" href="#carousel-example-1z" role="button" data-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="sr-only">Previous</span>
                  </a>
                  <a class="carousel-control-next" href="#carousel-example-1z" role="button" data-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="sr-only">Next</span>
                  </a>
                </div>
              </div>
              <div class="col-md-6">
                <a href="" class="primary-text">
                  <h6 class="pb-1"><i class="fas fa-heart"></i><strong> Lifestyle </strong></h6>
                </a>
                <h4 class="mb-3"><strong>This is a placeholder blog</strong></h4>
                <p>Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod
                maxime
                placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus et aut officiis
                        debitis aut rerum.</p>

                <p>Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod
                maxime
                placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus et aut officiis
                        debitis aut rerum.</p>
                <p>by <a><strong>Jane Doe</strong></a>, 01/01/2020</p>
                <a href="https://kochiiblog.wordpress.com/" target="_blank" class="btn blue-gradient btn-md"
                  style={{ borderRadius: '10em' }}>Read more</a>

              </div>
            </div>
          </section>
        </div>
        <hr class="my-5" />
        <section id="contact" class="container mb-5">
            <h2 class="mb-5 font-weight-bold text-center">Contact</h2>
            <h3 class="mb-5 text-center">Get a hold of us. We’re always happy to talk!</h3>
            <form class="grey-text" action="/contact" method="post">
                <div class="md-form form-sm"> <i class="fas fa-user prefix"></i>
                    <input type="text" name="from_name" id="name" class="form-control form-control-sm"
                        placeholder="Name" />
                </div>
                <div class="md-form form-sm"> <i class="fas fa-envelope prefix"></i>
                    <input type="text" name="from_email" id="email" class="form-control form-control-sm"
                        placeholder="Email" />
                </div>
                <div class="md-form form-sm"> <i class="fas fa-pencil-alt prefix"></i>
                    <textarea type="text" name="body" id="body" class="md-textarea form-control form-control-sm"
                        rows="10" style={{ resize: 'none' }} placeholder="Message"></textarea>
                </div>
                <div class="text-center mt-4">
                    <button type="submit" class="btn blue-gradient" style={{ borderRadius: '10em' }}>Send<i
                            class="far fa-paper-planeml-1"></i></button>
                </div>
            </form>
        </section>
      </main>
    </React.Fragment>
  )
};

export default Intro;
