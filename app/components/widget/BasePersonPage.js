/**
 * Created by guoshuyu on 2017/11/10.
 */

import React, {Component} from 'react';
import {
    View, Text, StatusBar, Image, InteractionManager
} from 'react-native';
import styles from "../../style"
import * as Constant from '../../style/constant'
import eventActions from '../../store/actions/event'
import UserHeadItem from './UserHeadItem'
import PullListView from './PullLoadMoreListView'
import EventItem from './EventItem'
import {getActionAndDes} from '../../utils/eventUtils'
import * as Config from '../../config/'
import I18n from '../../style/i18n'

class BasePersonPage extends Component {

    constructor(props) {
        super(props);
        this._refresh = this._refresh.bind(this);
        this._loadMore = this._loadMore.bind(this);
        this.state = {
            dataSource: []
        };
        this.page = 2;
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.refs.pullList.showRefreshState();
            this._refresh();
        })
    }

    componentWillUnmount() {

    }

    _renderRow(rowData, sectionID, rowID, highlightRow) {
        let res = getActionAndDes(rowData);
        return (
            <EventItem
                actionTime={rowData.created_at}
                actionUser={rowData.actor.display_login}
                actionUserPic={rowData.actor.avatar_url}
                des={res.des}
                actionTarget={res.actionStr}/>
        )
    }

    /**
     * 刷新
     * */
    _refresh() {
        let userInfo = this.getUserInfo();
        eventActions.getEvent(1, userInfo.login).then((res) => {
            let size = 0;
            if (res && res.result) {
                this.page = 2;
                this.setState({
                    dataSource: res.data
                });
                size = res.data.length;
            }
            setTimeout(() => {
                if (this.refs.pullList) {
                    this.refs.pullList.refreshComplete((size >= Config.PAGE_SIZE));
                }
            }, 500);
        })
    }

    /**
     * 加载更多
     * */
    _loadMore() {
        let userInfo = this.getUserInfo();
        eventActions.getEvent(this.page, userInfo.login).then((res) => {
            this.page++;
            let size = 0;
            if (res && res.result) {
                let localData = this.state.dataSource.concat(res.data);
                this.setState({
                    dataSource: localData
                });
                size = res.data.length;
            }
            setTimeout(() => {
                if (this.refs.pullList) {
                    this.refs.pullList.loadMoreComplete((size >= Config.PAGE_SIZE));
                }
            }, 500);
        });
    }

    getUserInfo() {
        return {}
    }

    getSetting() {
        return false;
    }

    render() {
        let userInfo = this.getUserInfo();
        return (
            <View style={styles.mainBox}>
                <StatusBar hidden={false} backgroundColor={'transparent'} translucent barStyle={'light-content'}/>
                <PullListView
                    style={{flex: 1}}
                    ref="pullList"
                    renderHeader={() => {
                        return (
                            <View>
                                <UserHeadItem
                                    userDisPlayName={userInfo.login}
                                    userName={userInfo.name}
                                    userPic={userInfo.avatar_url}
                                    groupName={userInfo.company}
                                    location={userInfo.location}
                                    link={userInfo.blog}
                                    des={userInfo.bio}
                                    star={(userInfo.starred) ? userInfo.starred : "---"}
                                    repos={userInfo.public_repos + ""}
                                    follower={userInfo.followers + ""}
                                    followed={userInfo.following + ""}
                                    setting={this.getSetting()}
                                />
                                <View style={styles.flex}>
                                    <Text style={[styles.normalText, {
                                        fontWeight: "bold", marginTop: Constant.normalMarginEdge,
                                        marginLeft: Constant.normalMarginEdge,
                                    }]}>
                                        {I18n('personDynamic')}
                                    </Text>
                                </View>
                            </View>
                        );
                    }}
                    render
                    renderRow={(rowData, sectionID, rowID, highlightRow) =>
                        this._renderRow(rowData, sectionID, rowID, highlightRow)
                    }
                    refresh={this._refresh}
                    loadMore={this._loadMore}
                    dataSource={this.state.dataSource}
                />
            </View>
        )
    }
}

export default BasePersonPage