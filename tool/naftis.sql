/*
Naftis migrate script.
Source Server         : *
Source Server Version : 50721
Source Host           : *
Source Database       : naftis

Target Server Type    : MYSQL
Target Server Version : 50721
File Encoding         : 65001
*/

DROP DATABASE IF EXISTS `naftis`;
CREATE DATABASE `naftis`;

GRANT ALL PRIVILEGES ON `naftis`.* TO 'naftis'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;

USE `naftis`;
SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for task_tmpl_vars
-- ----------------------------
DROP TABLE IF EXISTS `task_tmpl_vars`;
CREATE TABLE `task_tmpl_vars` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `task_tmpl_id` int(10) NOT NULL COMMENT 'task template id',
  `name` varchar(255) DEFAULT NULL COMMENT 'variable name',
  `title` varchar(255) DEFAULT NULL COMMENT 'variable title',
  `comment` varchar(255) DEFAULT NULL COMMENT 'variable comment',
  `form_type` tinyint(4) DEFAULT NULL COMMENT 'variable form item type',
  `data_source` varchar(255) DEFAULT NULL COMMENT 'variable data source',
  `default` varchar(255) DEFAULT NULL COMMENT 'variable default value',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=78 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of task_tmpl_vars
-- ----------------------------
INSERT INTO `task_tmpl_vars` VALUES ('33', '43', 'Host', 'Host', 'Host', '4', 'Host', null);
INSERT INTO `task_tmpl_vars` VALUES ('34', '43', 'DestinationSubset', 'DestinationSubset', 'DestinationSubset', '1', '', null);
INSERT INTO `task_tmpl_vars` VALUES ('35', '44', 'Host', 'Host', 'Host', '4', 'Host', null);
INSERT INTO `task_tmpl_vars` VALUES ('36', '44', 'DestinationSubset1', 'DestinationSubset1', 'DestinationSubset1', '1', '', null);
INSERT INTO `task_tmpl_vars` VALUES ('37', '44', 'Weight1', 'Weight1', 'Weight1', '3', '', null);
INSERT INTO `task_tmpl_vars` VALUES ('38', '44', 'DestinationSubset2', 'DestinationSubset2', 'DestinationSubset2', '1', '', null);
INSERT INTO `task_tmpl_vars` VALUES ('39', '44', 'Weight2', 'Weight2', 'Weight2', '3', '', null);
INSERT INTO `task_tmpl_vars` VALUES ('40', '45', 'Host', 'Host', 'Host', '4', 'Host', null);
INSERT INTO `task_tmpl_vars` VALUES ('41', '45', 'MaxConnections', 'MaxConnections', 'MaxConnections', '2', '', null);
INSERT INTO `task_tmpl_vars` VALUES ('42', '45', 'Http1MaxPendingRequests', 'Http1MaxPendingRequests', 'Http1MaxPendingRequests', '2', '', null);
INSERT INTO `task_tmpl_vars` VALUES ('43', '45', 'MaxRequestsPerConnection', 'MaxRequestsPerConnection', 'MaxRequestsPerConnection', '2', '', null);
INSERT INTO `task_tmpl_vars` VALUES ('44', '46', 'DestinationHost', 'DestinationHost', 'DestinationHost', '4', 'Host', null);
INSERT INTO `task_tmpl_vars` VALUES ('45', '46', 'SourceHost', 'SourceHost', 'SourceHost', '4', 'Host', null);
INSERT INTO `task_tmpl_vars` VALUES ('46', '46', 'SourceVersion', 'SourceVersion', 'SourceVersion', '1', '', null);
INSERT INTO `task_tmpl_vars` VALUES ('47', '46', 'MaxAmount', 'MaxAmount', 'MaxAmount', '2', '', null);
INSERT INTO `task_tmpl_vars` VALUES ('48', '47', 'Host', 'Host', 'Host', '4', 'Host', null);
INSERT INTO `task_tmpl_vars` VALUES ('49', '47', 'DestinationSubset', 'DestinationSubset', 'DestinationSubset', '1', '', null);
INSERT INTO `task_tmpl_vars` VALUES ('50', '47', 'Timeout', 'Timeout', 'Timeout', '2', '', null);
INSERT INTO `task_tmpl_vars` VALUES ('68', '59', 'Host', '2', '2', '1', '', null);
INSERT INTO `task_tmpl_vars` VALUES ('69', '59', 'DestinationSubset', '32', '22', '1', '', null);
INSERT INTO `task_tmpl_vars` VALUES ('70', '60', 'Host', 'Host', 'Host', '4', 'host', null);
INSERT INTO `task_tmpl_vars` VALUES ('71', '60', 'DestinationSubset', 'DestinationSubset', 'DestinationSubset', '1', '', null);
INSERT INTO `task_tmpl_vars` VALUES ('72', '61', 'Host', 'Host', 'Host', '4', 'host', null);
INSERT INTO `task_tmpl_vars` VALUES ('73', '61', 'DestinationSubset', 'DestinationSubset', 'DestinationSubset', '1', '', null);
INSERT INTO `task_tmpl_vars` VALUES ('74', '63', 'Host', 'Host', 'Host', '1', 'Host', null);
INSERT INTO `task_tmpl_vars` VALUES ('75', '63', 'DestinationSubset', 'DestinationSubset', 'DestinationSubset', '1', 'DestinationSubset', null);
INSERT INTO `task_tmpl_vars` VALUES ('76', '65', 'Host', 'host', 'host', '4', 'host', null);
INSERT INTO `task_tmpl_vars` VALUES ('77', '65', 'DestinationSubset', 'destinationSubset', 'destinationSubset', '1', '', null);

-- ----------------------------
-- Table structure for task_tmpls
-- ----------------------------
DROP TABLE IF EXISTS `task_tmpls`;
CREATE TABLE `task_tmpls` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT NULL COMMENT 'create time',
  `updated_at` timestamp NULL DEFAULT NULL COMMENT 'update time',
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT 'delete time',
  `name` varchar(255) DEFAULT NULL COMMENT 'name',
  `content` text COMMENT 'content',
  `brief` text COMMENT 'brief',
  `revision` int(11) DEFAULT NULL COMMENT 'revision',
  `operator` varchar(255) DEFAULT NULL COMMENT 'operator',
  `var_confirm` text COMMENT 'variable confirm comment',
  `icon` varchar(255) DEFAULT NULL COMMENT 'template icon in css',
  PRIMARY KEY (`id`),
  KEY `idx_cfg_tmpls_deleted_at` (`deleted_at`)
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of task_tmpls
-- ----------------------------
INSERT INTO `task_tmpls` VALUES ('43', '2018-07-24 10:16:32', '2018-07-24 10:16:32', null, 'RequestRouting', 'apiVersion: networking.istio.io/v1alpha3\nkind: VirtualService\nmetadata:\n  name: {{.Host}}\nspec:\n  hosts:\n  - {{.Host}}\n  http:\n  - route:\n    - destination:\n        host: {{.Host}}\n        subset: {{.DestinationSubset}}\n', 'The template will route requests dynamically to multiple versions of a microservice.', '1', 'admin', '', 'tpl/requestRouting.png');
INSERT INTO `task_tmpls` VALUES ('44', '2018-07-24 10:32:34', '2018-07-24 10:32:34', null, 'TrafficShifting', 'apiVersion: networking.istio.io/v1alpha3\nkind: VirtualService\nmetadata:\n  name: {{.Host}}\nspec:\n  hosts:\n  - reviews\n  http:\n  - route:\n    - destination:\n        host: {{.Host}}\n        subset: {{.DestinationSubset1}}\n      weight: {{.Weight1}}\n    - destination:\n        host: {{.Host}}\n        subset: {{.DestinationSubset2}}\n      weight: {{.Weight2}}\n', 'The template will gradually migrate traffic from one version of a microservice to another.', '1', 'admin', '', 'tpl/trafficShifting.png');
INSERT INTO `task_tmpls` VALUES ('45', '2018-07-24 10:37:04', '2018-07-24 10:37:04', null, 'CircuitBreaking', 'apiVersion: networking.istio.io/v1alpha3\nkind: DestinationRule\nmetadata:\n  name: {{.Host}}\nspec:\n  name: {{.Host}}\n  trafficPolicy:\n    connectionPool:\n      tcp:\n        maxConnections: {{.MaxConnections}}\n      http:\n        http1MaxPendingRequests: {{.Http1MaxPendingRequests}}\n        maxRequestsPerConnection: {{.MaxRequestsPerConnection}}\n    outlierDetection:\n      http:\n        consecutiveErrors: 1\n        interval: 1s\n        baseEjectionTime: 3m\n        maxEjectionPercent: 100\n', 'The template will configure circuit breaking for connections, requests, and outlier detection.', '1', 'admin', '', 'tpl/circuitBreaking.png');
INSERT INTO `task_tmpls` VALUES ('46', '2018-07-24 10:44:39', '2018-07-24 10:44:39', null, 'RateLimit', 'apiVersion: config.istio.io/v1alpha2\nkind: memquota\nmetadata:\n  name: handler\n  namespace: istio-system\nspec:\n  quotas:\n  - name: requestcount.quota.istio-system\n    # default rate limit is 5000qps\n    maxAmount: 5000\n    validDuration: 1s\n    # The first matching override is applied.\n    # A requestcount instance is checked against override dimensions.\n    overrides:\n    # The following override applies to traffic from \'rewiews\' version v2,\n    # destined for the ratings service. The destinationVersion dimension is ignored.\n    - dimensions:\n        destination: {{.DestinationHost}}\n        source: {{.SourceHost}}\n        sourceVersion: {{.SourceVersion}}\n      maxAmount: {{.MaxAmount}}\n      validDuration: 1s\n', 'The template will setup rate limitation of requests.', '1', 'admin', '', 'tpl/rateLimit.png');
INSERT INTO `task_tmpls` VALUES ('47', '2018-07-24 10:48:29', '2018-07-24 10:48:29', null, 'Timeout', 'apiVersion: networking.istio.io/v1alpha3\nkind: VirtualService\nmetadata:\n  name: {{.Host}}\nspec:\n  hosts:\n    - {{.Host}}\n  http:\n  - route:\n    - destination:\n        name: {{.Host}}\n        subset: {{.DestinationSubset}}\n    timeout: {{.Timeout}}s\n', 'The template will setup request timeouts in Envoy using Istio.', '1', 'admin', '', 'tpl/timeout.png');

-- ----------------------------
-- Table structure for tasks
-- ----------------------------
DROP TABLE IF EXISTS `tasks`;
CREATE TABLE `tasks` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT NULL COMMENT 'create time',
  `updated_at` timestamp NULL DEFAULT NULL COMMENT 'update time',
  `deleted_at` timestamp NULL DEFAULT NULL COMMENT 'delete time',
  `content` text COMMENT 'content',
  `revision` int(11) DEFAULT NULL COMMENT 'revision',
  `operator` varchar(255) DEFAULT NULL COMMENT 'operator',
  `task_tmpl_id` int(10) NOT NULL COMMENT 'task template id',
  `service_uid` varchar(255) DEFAULT NULL COMMENT 'chosen service id',
  `namespace` varchar(255) DEFAULT NULL COMMENT 'namespace out of the task content',
  `status` tinyint(4) DEFAULT NULL COMMENT 'task current status',
  `prev_state` text COMMENT 'prev istio resource state in yaml',
  `command` tinyint(4) DEFAULT NULL COMMENT 'command of task',
  PRIMARY KEY (`id`),
  KEY `idx_cfgs_deleted_at` (`deleted_at`),
  KEY `task_tmpl_id` (`task_tmpl_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=147 DEFAULT CHARSET=utf8mb4;
