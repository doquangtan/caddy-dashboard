import React, { Fragment, useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { GetConfig, GetHttpRoutes } from './helper';
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Box, Collapse, IconButton, Typography } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

function capitalizeFirstLetter(val: string) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

function Row(props: {
  path?: any,
  row?: any,
  route: any,
  port?: any,
  server?: any,
}) {
  const { path, row, route, port, server } = props;
  const [open, setOpen] = React.useState<boolean>(false);

  return <>
    <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
      <TableCell>
        <IconButton
          aria-label="expand row"
          size="small"
          onClick={() => {
            // setOpen({
            //   ...open,
            //   [`${handleIndex}`]: open[`${handleIndex}`] == true ? false : true,
            // })
            setOpen(!open)
          }}
        >
          {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </IconButton>
      </TableCell>
      <TableCell component="th" scope="row">
        {route.match &&
          Object.keys(route.match).map((v: any) => {
            const match = route.match[v];
            return <Match key={v} match={match} />
          })}
      </TableCell>
      <TableCell align="right">{route.port}</TableCell>
      <TableCell align="right">{route.name}</TableCell>
      <TableCell align="right">
        <div>
          {route.handle.handler}
        </div>
      </TableCell>
    </TableRow>
    <TableRow>
      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Box sx={{ margin: 1 }}>
            <Route route={{
              ...route,
              handle: [route.handle],
            }} />
          </Box>
        </Collapse>
      </TableCell>
    </TableRow>
  </>

  // return <>
  //   {route.handle &&
  //     Object.keys(route.handle).map((v: any, handleIndex: number) => {
  //       const handle = route.handle[v];
  //       if (handle.handler === 'subroute') {
  //         return <Fragment key={`${path}/handle/${handleIndex}`}>
  //           {handle.routes.map((v: any, routeIndex: number) => {
  //             if (route.match == null) {
  //               route.match = [];
  //             }
  //             if (v.match != null) {
  //               v.match = [...route.match, ...v.match]
  //             } else {
  //               v.match = [...route.match]
  //             }
  //             return <Fragment key={`${path}/handle/${handleIndex}/routes/${routeIndex}`}>
  //               <Row
  //                 path={`${path}/handle/${handleIndex}/routes/${routeIndex}`}
  //                 row={v}
  //                 route={v}
  //                 server={server}
  //                 port={port}
  //               />
  //             </Fragment>
  //           })}
  //         </Fragment>
  //       } else {
  //         return <Fragment key={`${path}/handle/${handleIndex}`}>
  //           <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
  //             <TableCell>
  //               <IconButton
  //                 aria-label="expand row"
  //                 size="small"
  //                 onClick={() => {
  //                   setOpen({
  //                     ...open,
  //                     [`${handleIndex}`]: open[`${handleIndex}`] == true ? false : true,
  //                   })
  //                 }}
  //               >
  //                 {open[`${handleIndex}`] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
  //               </IconButton>
  //             </TableCell>
  //             <TableCell component="th" scope="row">
  //               {route.match &&
  //                 Object.keys(route.match).map((v: any) => {
  //                   const match = route.match[v];
  //                   return <Match key={v} match={match} />
  //                 })}
  //             </TableCell>
  //             <TableCell align="right">{port}</TableCell>
  //             <TableCell align="right">{server}</TableCell>
  //             <TableCell align="right">
  //               <div>
  //                 {handle.handler}
  //               </div>
  //             </TableCell>
  //           </TableRow>
  //           <TableRow>
  //             <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
  //               <Collapse in={open[`${handleIndex}`]} timeout="auto" unmountOnExit>
  //                 <Box sx={{ margin: 1 }}>
  //                   <Route route={{
  //                     ...row,
  //                     handle: [handle]
  //                   }} />
  //                 </Box>
  //               </Collapse>
  //             </TableCell>
  //           </TableRow>
  //         </Fragment>
  //       }
  //     })}
  // </>
}

function Route(props: {
  route: any,
  stye?: React.CSSProperties,
}) {
  const { route, stye } = props;

  return <fieldset style={{
    padding: 10,
    border: 'none',
    borderRadius: 10,
    backgroundColor: '#eee',
    ...stye,
  }}>
    <legend style={{ textAlign: 'left', }}>Route:</legend>
    <div>
      {route.match && <>
        Match:
        <div style={{
          padding: 10,
        }}>
          {Object.keys(route.match).map((v: any) => {
            const match = route.match[v];
            return <Match key={v} match={match} />
          })}
        </div>
      </>}
      Middleware:
      <div style={{
        padding: 10,
        display: 'flex',
        gap: 10,
      }}>
        {route.middleware &&
          route.middleware.map((middleware: any) => {
            return <Route
              route={{
                ...middleware,
                handle: [middleware.handle],
              }}
              stye={{
                backgroundColor: '#e5f10029',
              }}
            />
          })}
      </div>
      Handle:
      <div style={{
        padding: 10,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}>
        {route.handle &&
          Object.keys(route.handle).map((v: any) => {
            const handle = route.handle[v];
            return <Handle key={v} handle={handle} />
          })}
      </div>
    </div>
  </fieldset>
}

function Match(props: {
  match: any
}) {
  const { match } = props;
  return <div>
    {Object.keys(match).map(key => <div key={key}>
      {capitalizeFirstLetter(key)}({JSON.stringify(match[key])})
    </div>)}
  </div>
}

function Handle(props: {
  handle: any
}) {
  const { handle } = props;
  return <div style={{
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#eef',
  }}>
    {Object.keys(handle).map(key => key !== "routes" && <div key={key}>
      {capitalizeFirstLetter(key)}:
      <div style={{
        padding: 10,
      }}>
        <pre>
          {JSON.stringify(handle[key], null, 2)}
        </pre>
      </div>
    </div>)}
    {handle.routes && <>
      <div>
        Routes:
      </div>
      <div style={{
        padding: 10,
        display: 'flex',
        gap: 10,
      }}>
        {handle.routes.map((v: any, index: number) => {
          return <Route key={index} route={v} />
        })}
      </div>
    </>}
  </div>
}

function App() {
  const [config, setConfig] = useState<any>({});
  const [httpRouter, setHttpRouters] = useState<any>([]);

  useEffect(() => {
    async function init() {
      try {
        const _config = await GetConfig()
        setConfig(_config);
        console.log(_config);

        const _httpRouter = await GetHttpRoutes()
        setHttpRouters(_httpRouter);

      } catch (error) {
        console.log(error)
      }
    }
    init()
  }, []);

  return (
    <div style={{
      padding: 20,
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
      }}>
        <h1 style={{
          color: 'white',
          flex: 1,
          maxWidth: 1400,
          margin: 0,
        }}>
          HTTP Routes:
        </h1>
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'center'
      }}>
        <TableContainer component={Paper} style={{
          maxWidth: 1400,
        }}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Match</TableCell>
                <TableCell align="right">Port</TableCell>
                <TableCell align="right">Server</TableCell>
                <TableCell align="right">Handle</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {httpRouter.map((v: any, i: number) => {
                return <Row
                  key={i}
                  // path={``}
                  // row={}
                  route={v}
                // port={server.listen}
                />
              })}
              {/* {config?.apps?.http?.servers &&
                Object.keys(config?.apps?.http?.servers).map((serverName: any) => {
                  const server = config?.apps?.http?.servers[serverName];
                  return <Fragment key={serverName}>
                    {server.routes &&
                      Object.keys(server.routes).map((v: any) => {
                        const route = server.routes[v];
                        return <Row
                          key={`/${serverName}/routes/${v}`}
                          path={`/${serverName}/routes/${v}`}
                          row={route}
                          route={route}
                          server={serverName}
                          port={server.listen}
                        />
                      })}
                  </Fragment>
                })
              } */}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      {/* <div>
        Http:
        <div>
          {config?.apps?.http?.servers &&
            Object.keys(config?.apps?.http?.servers).map((v: any) => {
              const server = config?.apps?.http?.servers[v];
              return <div key={v}>
                Server: {v}
                <div>
                  Port: {server.listen}
                </div>
                <div>
                  <div style={{
                    padding: 10,
                  }}>
                    {server.routes &&
                      Object.keys(server.routes).map((v: any) => {
                        const route = server.routes[v];
                        return <div key={v}>
                          Handle:
                          <div style={{
                            padding: 10,
                          }}>
                            {route.handle &&
                              Object.keys(route.handle).map((v: any) => {
                                const handle = route.handle[v];
                                return <div key={v}>
                                  <div>
                                    Handler: {handle.handler}
                                  </div>
                                  Routes: {handle.handler}
                                </div>
                              })}
                          </div>
                          Match:
                          <div style={{
                            padding: 10,
                          }}>
                            {route.match &&
                              Object.keys(route.match).map((v: any) => {
                                const match = route.match[v];
                                return <div key={v}>
                                  Host: {match.host}
                                </div>
                              })}
                          </div>
                        </div>
                      })}
                  </div>
                </div>
              </div>
            })}

        </div>
      </div>
      <div>
        Tls:
      </div> */}
    </div>
  );
}

export default App;
