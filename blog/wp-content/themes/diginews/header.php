<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>" />
<meta name="viewport" content="width=device-width" />
<link rel="profile" href="http://gmpg.org/xfn/11" />
<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>" />


<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>


	
	
<div id="container">
<?php do_action( 'before' ); ?>
	<header id="branding" role="banner">
      <div id="inner-header" class="clearfix">
		<hgroup id="site-heading">
			<h1 id="site-title"><a href="<?php echo home_url( '/' ); ?>" title="<?php echo esc_attr( get_bloginfo( 'name', 'display' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a></h1>
			<h2 id="site-description"><?php bloginfo( 'description' ); ?></h2>
		</hgroup>

		  <!--theme of eejin -->
			<div style="width:960px;padding-top:5px;padding-bottom:10px;margin:0 auto">
			
			<!-- BEGIN NAVIGATION -->
		     
		    <ul id="menu">
		    	<li><a href="http://mirinae.jp/index.html"><img src="http://mirinae.jp/img/images/navi_01.png" alt=""/></a></li>
		    	
		    	<li><a href="#"><img src="http://mirinae.jp/img/images/navi_02.png" alt=""/></a>
		    		<ul>
						<li><a href="kojin.php?class=textbook">レベルと進み方</a></li>
						<li><a href="kojin.php?class=kojin">個人レッスン</a></li>
						<li><a href="kojin.php?class=tanki">短期集中個人レッスン</a></li>
						<li><a href="kojin.php?class=hatsuon">発音矯正個人レッスン</a></li>
						<li><a href="kojin.php?class=eigo">英会話個人レッスン</a></li>
		    		</ul>
		    	</li>
		    	
		    	<li><a href="#"><img src="http://mirinae.jp/img/images/navi_03.png" alt=""/></a>
		    		<ul>
						<li><a href="group.php?class=nyumon">入門｜ハングル6週間コース</a></li>
						<li><a href="group.php?class=syokyu">初級｜平日グループコース</a></li>
						<li><a href="group.php?class=tyukyu">中級｜文法会話6ヶ月コース</a></li>
						<li><a href="group.php?class=tensaku">中級｜月1回文法添削コース</a></li>
						<li><a href="group.php?class=joukyu1">上級1｜1・3週目土曜講座</a></li>
		    		</ul>
		    	</li>
		    	
		    	<li><a href="#"><img src="http://mirinae.jp/img/images/navi_04.png" alt=""/></a>
		    		<ul>
						<li><a href="kaiwa.php?class=kaiwa">会話トレーニング</a></li>
						<li><a href="kaiwa.php?class=ondoku">音読講座</a></li>
						<li><a href="kaiwa.php?class=into">発音・抑揚講座</a></li>
						<li><a href="kaiwa.php?class=sisa">時事韓国語</a></li>
						<li><a href="kaiwa.php?class=asaben">朝勉クラス</a></li>
						<li><a href="kaiwa.php?class=douga">上級動画討論</a></li>
		    		</ul>
		    	</li>
		    	
		    	<li><a href="#"><img src="http://mirinae.jp/img/images/navi_05.png" alt=""/></a>
					<ul>
						 <li><a href="special.php?class=topik12">TOPIK初級(1・2)対策講座</a></li>
						 <li><a href="special.php?class=topik34">TOPIK中級(3・4)対策講座</a></li>
						 <li><a href="special.php?class=topik56">TOPIK上級(5・6)対策講座</a></li>		 
						 <li><a href="special.php?class=hanken1">ハングル検定1・2級対策講座</a></li>    
						 <li><a href="special.php?class=hankenj2">ハングル検定準２級対策講座</a></li>          
						 <li><a href="special.php?class=voca">語彙力強化クラス</a></li>  
					</ul>
				</li>
				
				<li><a href="#"><img src="http://mirinae.jp/img/images/navi_06.png" alt=""/></a>
					<ul>
							<li><a href="syutyu.php?class=nyumon">入門クラス</a></li>
							<li><a href="syutyu.php?class=syokyu">初級クラス</a></li>
							<li><a href="syutyu.php?class=tyukyu">中級クラス</a></li>
							<li><a href="syutyu.php?class=joukyu">上級クラス</a></li>	
					</ul>
				</li>
				
				<li><a href="#"><img src="http://mirinae.jp/img/images/navi_07.png" alt=""/></a>
					<ul>
							 <li><a href="castigation.php?class=writing">作文トレーニング</a></li>
							 <li><a href="castigation.php?class=netondoku">通信音読トレーニング</a></li>
							<li><a href="castigation.php?class=net">ネットレッスン</a></li>
							<li><a href="castigation.php?class=castigator">翻訳コース</a></li>	
							<li><a href="http://mirinae.jp/castigation.php?class=topikwriting">TOPIKトレーニング</a></li>
					</ul>
				</li>
				
				<li><a href="#"><img src="http://mirinae.jp/img/images/navi_08.png" alt=""/></a>
					<ul>
						 <li><a href="trial.php?class=trial">お申し込み</a></li>
						 <li><a href="trial.php?class=sodan">レベルテスト＆相談</a></li>
						 <li><a href="trial.php?class=month">今月の注目レッスン</a></li>
						 <li><a href="trial.php?class=year">講座日程</a></li>
						 <li><a href="trial.php?class=mail">メールマガジン</a></li>
						 <li><a href="book.php">ミリネで出版した本</a></li>
						 <li><a href="koe.php">受講生の声</a></li>
						<li><a href="http://mirinae.jp/contact.html">お問合せ</a></li>
					</ul>
				</li>
			</ul>
			<!-- END NAVIGATION -->
			
		</div>		  
		  
		 <br>
		  
		  
		<nav id="access" role="navigation">
			<h1 class="assistive-text section-heading"><?php _e( 'Main menu', 'diginews' ); ?></h1>
			<div class="skip-link screen-reader-text"><a href="#content" title="<?php esc_attr_e( 'Skip to content', 'diginews' ); ?>"><?php _e( 'Skip to content', 'diginews' ); ?></a></div>
			<?php diginews_main_nav(); // Adjust using Menus in WordPress Admin ?>
			
			<!--<?php get_search_form(); ?>->
	
		  </nav><!-- #access -->
        

			
			
      </div>
   

		
      
	</header><!-- #branding -->
