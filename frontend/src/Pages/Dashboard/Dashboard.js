import React, { Fragment, useState, useEffect, useCallback } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Graph from '../../Components/Graph/Graph';
import './Dashboard.css';
import DashboardNavBar from '../../Components/DashboardNavBar/DashboardNavBar';
import { BarLoader } from 'react-spinners';
import Watchlist from '../../Components/Watchlist/Watchlist';
import Info from '../../Components/Info/Info';
import { user } from '../../Api/User';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function getCoinInfo(name, setFn, setLoading) {
  user
    .getCoin(name)
    .then((res) => {
      setFn(res.data);
      setLoading(false);
    })
    .catch((err) => {
      console.log(err);
    });
}

function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [coinData, setCoinData] = useState(null);
  const [watchlist, setWatchList] = useState(null);
  const [graphType, setGraphType] = useState(true);

  useEffect(() => {
    getWatchlist();
  }, []);

  // using this function re-renders all other necessary data on page.
  function changeCoin(coin) {
    setLoading(true);
    getCoinInfo(coin, setCoinData, setLoading);
  }

  function getWatchlist() {
    user
      .getWatchlist()
      .then((res) => {
        setWatchList(res.data.watchlist);
      })
      .then(() => {
        return watchlist && watchlist.length > 0 ? watchlist[0] : 'dogecoin';
      })
      .then((coin) => {
        getCoinInfo(coin, setCoinData, setLoading);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function addToWatchList() {
    user
      .addToWatchlist(coinData.id)
      .then((res) => {
        // possibly validate res here
        if (watchlist.indexOf(coinData.id) < 0) {
          setWatchList([...watchlist, coinData.id]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function removeFromWatchList(coin) {
    user
      .removeFromWatchlist(coin)
      .then(() => {
        setWatchList([...watchlist].filter((c) => c !== coin));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleDragEnd(res) {
      if (!res.destination) {
          return;
      }
    const wlist = [...watchlist];
    const [reordered] = wlist.splice(res.source.index, 1);
    wlist.splice(res.destination.index, 0, reordered);

    setWatchList(wlist);
    user
      .updateWatchlist(wlist)
      .then(() => {})
      .catch((err) => {
        console.log(err);
      });
  }

  const graphTypeToggler = useCallback(() => {
    setGraphType(!graphType);
  }, [graphType]);

  return (
    <Fragment>
      <DashboardNavBar change={changeCoin} />
      <Container fluid>
        <Row>
          <Col xl={8}>
            <Row>
              {!loading && coinData ? (
                <div className="header-container">
                  <div className="coin-title-price">
                    <div className="title coin-title">
                      {coinData.name}: {coinData.symbol}
                    </div>
                    <div className="coin-price">${+coinData.priceUsd}</div>
                  </div>
                  <button className="coin-add" onClick={addToWatchList}>
                    Add to Watchlist
                  </button>
                </div>
              ) : (
                <div className="header-container">
                  <BarLoader width={300} color="#fff" />
                </div>
              )}
              {coinData && (
                <Graph
                  graphType={graphType}
                  changeType={graphTypeToggler}
                  key={coinData.id}
                  coin={coinData.id}
                />
              )}
            </Row>
            <Row>
              {coinData && <Info key={coinData.id} coin={coinData.id} />}
            </Row>
          </Col>
          <Col xl={4}>
            <div className="header-container title watchlist-title">
              WatchList
            </div>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="watchlist">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    className="watchlist"
                    {...provided.droppableProps}
                  >
                    {watchlist && watchlist.length > 0 ? (
                      [...watchlist].map((v, i) => (
                        <Draggable key={v} draggableId={v} index={i}>
                          {(provided) => (
                            <div
                              {...provided.dragHandleProps}
                              {...provided.draggableProps}
                            >
                              <Watchlist
                                innerRef={provided.innerRef}
                                coin={v}
                                changeCoin={changeCoin}
                                remove={removeFromWatchList}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))
                    ) : (
                      <div className="watchlist-placeholder">
                        <p>You have nothing in your Watchlist!</p>
                        <p>Search for crypto and click 'Add to Watchlist'!</p>
                      </div>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
}

export default Dashboard;
